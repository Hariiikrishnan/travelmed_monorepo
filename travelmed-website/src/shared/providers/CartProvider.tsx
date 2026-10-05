'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Order } from '@/types';
import { analytics, kitItem } from '@/shared/analytics/gtag';
import { useCatalog } from '@/shared/providers/ProductProvider';

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  /** Stores the server-confirmed order (after payment verification) and empties the bag. */
  completeOrder: (order: Order) => void;
  currentOrder: Order | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedItems, setCartItems] = useState<CartItem[]>([]);
  const catalog = useCatalog();

  // Name, price and image always come from the live, admin-managed kit — never from what was
  // saved earlier. Kits that were removed or hidden drop out of the bag.
  const cartItems = useMemo(
    () =>
      storedItems.flatMap((item) => {
        const kit = catalog.find((p) => p.id === item.id);
        if (!kit) return catalog.length ? [] : [item]; // keep as-is if the catalogue failed to load
        return [{ ...item, name: kit.name, price: kit.price, image: kit.images[0] ?? item.image, description: kit.tagline || item.description }];
      }),
    [storedItems, catalog]
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('travelmed_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('travelmed_cart', JSON.stringify(items));
  };

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const existingIndex = storedItems.findIndex(
      (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
    );
    
    if (existingIndex > -1) {
      const updated = storedItems.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: Math.min(20, i.quantity + (item.quantity || 1)) } : i
      );
      saveCart(updated);
    } else {
      saveCart([...storedItems, { ...item, quantity: item.quantity || 1 } as CartItem]);
    }
    analytics.addToCart([{ ...kitItem(item.quantity || 1, item.price), item_id: item.id, item_name: item.name }]);
    // Automatically open the cart drawer when a item is added
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    const updated = storedItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updated = storedItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.min(20, quantity) } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const completeOrder = (order: Order) => {
    setCurrentOrder(order);
    try {
      localStorage.setItem('travelmed_last_order', JSON.stringify(order));
    } catch {
      /* storage unavailable */
    }
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getCartTotal,
        getCartCount,
        completeOrder,
        currentOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

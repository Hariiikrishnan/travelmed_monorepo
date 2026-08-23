'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Order } from '@/types';

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
  placeOrder: (
    shippingAddress: Order['shippingAddress'],
    paymentDetails?: { paymentId: string; paymentStatus: string },
    couponCode?: string
  ) => Promise<Order>;
  currentOrder: Order | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
    const existingIndex = cartItems.findIndex(
      (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
    );
    
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += item.quantity || 1;
      saveCart(updated);
    } else {
      saveCart([...cartItems, { ...item, quantity: item.quantity || 1 } as CartItem]);
    }
    // Automatically open the cart drawer when a item is added
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updated = cartItems.map((item) => 
      item.id === id ? { ...item, quantity } : item
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

  const placeOrder = async (
    shippingAddress: Order['shippingAddress'],
    paymentDetails?: { paymentId: string; paymentStatus: string },
    couponCode?: string
  ): Promise<Order> => {
    try {
      const token = localStorage.getItem('travelmed_client_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          shippingAddress,
          couponCode,
          paymentStatus: paymentDetails?.paymentStatus || 'Pending',
          paymentId: paymentDetails?.paymentId || null,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            type: item.type,
            description: item.description || '',
            options: item.options || {}
          }))
        })
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || 'Failed to place order');
      }

      const newOrder = body.data;
      setCurrentOrder(newOrder);
      localStorage.setItem('travelmed_last_order', JSON.stringify(newOrder));
      clearCart();
      return newOrder;
    } catch (e) {
      console.error('Failed to place order', e);
      throw e;
    }
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
        placeOrder,
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

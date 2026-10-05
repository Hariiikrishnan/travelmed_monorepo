'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { derivePricing, pickFeatured, type Pricing, type ProductInfo } from '@/shared/pricing';

interface CatalogContext {
  catalog: ProductInfo[];
  featured: ProductInfo | null;
}

const ProductContext = createContext<CatalogContext>({ catalog: [], featured: null });

/** Supplies the server-fetched, admin-managed kit catalogue to client components. */
export function ProductProvider({ catalog, children }: { catalog: ProductInfo[]; children: React.ReactNode }) {
  const value = useMemo(() => ({ catalog, featured: pickFeatured(catalog) }), [catalog]);
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

/** All visible kits in display order. */
export const useCatalog = () => useContext(ProductContext).catalog;

/**
 * Live pricing for a kit (by id or slug), or for the featured kit when no id is given.
 * Null when the kit couldn't be loaded.
 */
export function usePricing(productId?: string): Pricing | null {
  const { catalog, featured } = useContext(ProductContext);
  return useMemo(() => {
    const product = productId ? catalog.find((p) => p.id === productId || p.slug === productId) : featured;
    return derivePricing(product);
  }, [catalog, featured, productId]);
}

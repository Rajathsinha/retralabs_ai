import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

// ── Coupon types ──────────────────────────────────────────────────────────────
type CouponDiscount =
  | { type: 'flat';    value: number }
  | { type: 'percent'; value: number };

const COUPONS: Record<string, CouponDiscount> = {
  'new1k':       { type: 'flat',    value: 1000 },
  'bulk2000':    { type: 'flat',    value: 2000 },
  'welfare1000': { type: 'flat',    value: 1000 },
  'rajath':      { type: 'percent', value: 10   },
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDiscountAmount: () => number;
  // coupon
  couponCode: string | null;
  couponDiscount: CouponDiscount | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getCouponAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode,     setCouponCode]     = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<CouponDiscount | null>(null);

  const addToCart = (product: Product, variant: ProductVariant) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.variant.id === variant.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const isBacWater = (name: string) =>
    name.toLowerCase().includes('bacteriostatic water');

  // Per-item discount rate: only applies when buying 2+ of the SAME peptide
  // qty 2 → 10%  |  qty 3+ → 20%  |  supplies / qty 1 → 0%
  const getItemDiscountRate = (item: CartItem): number => {
    if (isBacWater(item.product.name)) return 0;
    if (item.quantity >= 3) return 20;
    if (item.quantity === 2) return 10;
    return 0;
  };

  // Returns the highest discount tier active in the cart (for display only)
  const getDiscount = () =>
    cart.reduce((max, item) => Math.max(max, getItemDiscountRate(item)), 0);

  const getSubtotal = () =>
    cart.reduce((total, item) => total + item.variant.price_inr * item.quantity, 0);

  const getDiscountAmount = () =>
    cart.reduce((total, item) => {
      const pct = getItemDiscountRate(item);
      return total + Math.round((item.variant.price_inr * item.quantity * pct) / 100);
    }, 0);

  // ── Coupon methods ──────────────────────────────────────────────────────────
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const found = COUPONS[code.trim().toLowerCase()];
    if (!found) {
      return { success: false, message: 'Invalid coupon code' };
    }
    setCouponCode(code.trim());
    setCouponDiscount(found);
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(null);
  };

  const getCouponAmount = (): number => {
    if (!couponDiscount) return 0;
    const base = getSubtotal() - getDiscountAmount(); // post-volume-discount total
    if (couponDiscount.type === 'flat') {
      return Math.min(couponDiscount.value, base); // never make total negative
    }
    return Math.round((base * couponDiscount.value) / 100);
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() - getCouponAmount();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getSubtotal,
        getDiscount,
        getDiscountAmount,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        getCouponAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

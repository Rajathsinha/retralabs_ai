import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getDiscount = () => {
    const totalQuantity = getTotalQuantity();
    if (totalQuantity >= 3) return 25;
    if (totalQuantity === 2) return 20;
    return 0;
  };

  const getSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.variant.price_inr * item.quantity,
      0
    );
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    return (subtotal * discount) / 100;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount();
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

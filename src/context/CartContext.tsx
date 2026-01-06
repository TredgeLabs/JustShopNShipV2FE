import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  itemId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (itemId: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  getCartItemQuantity: (itemId: string) => number;
  getTotalCartItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (itemId: string, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.itemId === itemId);
      if (existingItem) {
        return prev.map(item => item.itemId === itemId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { itemId, quantity }];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.itemId !== itemId));
    } else {
      setCart(prev => prev.map(item => item.itemId === itemId ? { ...item, quantity } : item));
    }
  };

  const getCartItemQuantity = (itemId: string) => {
    return cart.find(item => item.itemId === itemId)?.quantity || 0;
  };

  const getTotalCartItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, getCartItemQuantity, getTotalCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
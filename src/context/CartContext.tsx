import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // Unique ID (e.g., inv-123 or timestamp)
  itemId?: string; // Original Inventory ID if applicable
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image?: string;
  url: string;
  isEditing?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, field: keyof CartItem, value: any) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from Local Storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist to Local Storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      // Check if exact same item (ID, size, color) exists
      const existingIndex = prev.findIndex(item =>
        item.itemId === newItem.itemId &&
        item.size === newItem.size &&
        item.color === newItem.color
      );

      if (existingIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + newItem.quantity
        };
        return updatedCart;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItem = (id: string, field: keyof CartItem, value: any) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateCartItem, clearCart, getTotalPrice, getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
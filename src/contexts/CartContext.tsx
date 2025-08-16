import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  inclusions: string[];
  category: string;
  image: string;
  featured?: boolean;
}

interface CartItem {
  package: HealthPackage;
  quantity: number;
  selectedDate?: string;
  selectedTime?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (pkg: HealthPackage) => void;
  removeFromCart: (packageId: string) => void;
  updateCartItem: (packageId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('wellhaven_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wellhaven_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (pkg: HealthPackage) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.package.id === pkg.id);
      if (existingItem) {
        return prev.map(item =>
          item.package.id === pkg.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { package: pkg, quantity: 1 }];
    });
  };

  const removeFromCart = (packageId: string) => {
    setCartItems(prev => prev.filter(item => item.package.id !== packageId));
  };

  const updateCartItem = (packageId: string, updates: Partial<CartItem>) => {
    setCartItems(prev =>
      prev.map(item =>
        item.package.id === packageId
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.package.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      getTotalPrice,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
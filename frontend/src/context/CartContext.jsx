import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('canteenCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('canteenCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id || i.name === item.name);
      if (existingItem) {
        return prevCart.map((i) =>
          (i._id === item._id || i.name === item.name) ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId, itemName) => {
    setCart((prevCart) => prevCart.filter((i) => i._id !== itemId && i.name !== itemName));
  };

  const updateQuantity = (itemId, itemName, delta) => {
    setCart((prevCart) => {
      return prevCart.map((i) => {
        if (i._id === itemId || i.name === itemName) {
          const newQuantity = i.quantity + delta;
          return newQuantity > 0 ? { ...i, quantity: newQuantity } : i;
        }
        return i;
      });
    });
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

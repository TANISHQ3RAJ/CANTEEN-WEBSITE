import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-4 py-8 pb-32"
    >
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={item._id || item.name} 
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div className="flex gap-4 items-center w-full sm:w-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-xl text-gray-600">
                {item.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">₹{item.price}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                <button onClick={() => updateQuantity(item._id, item.name, -1)} className="p-1 hover:bg-white rounded-full transition-colors">
                  <Minus size={16} />
                </button>
                <span className="font-medium w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.name, 1)} className="p-1 hover:bg-white rounded-full transition-colors text-primary">
                  <Plus size={16} />
                </button>
              </div>
              <p className="font-bold text-lg min-w-[3rem] text-right">₹{item.price * item.quantity}</p>
              <button 
                onClick={() => removeFromCart(item._id, item.name)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">₹{getCartTotal()}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500">Tax & Fees</span>
          <span className="font-medium">₹0</span>
        </div>
        <div className="h-px bg-gray-200 mb-6"></div>
        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-bold">Total</span>
          <span className="text-2xl font-extrabold text-primary">₹{getCartTotal()}</span>
        </div>
        
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-colors text-lg flex justify-center items-center gap-2"
        >
          Proceed to Checkout <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

// Also import ArrowRight for the button
import { ArrowRight } from 'lucide-react';

export default Cart;

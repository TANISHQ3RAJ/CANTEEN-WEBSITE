import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CheckCircle, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase } from '../lib/supabase';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [error, setError] = useState('');

  if (cart.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!upiId) {
      setError('Please enter a valid UPI ID');
      return;
    }
    
    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        order_id: 'ORD' + Math.floor(10000 + Math.random() * 90000), // Map orderId to order_id for supabase column
        status: 'Pending',
        total_amount: getCartTotal(),
        items: cart.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        upi_ref: upiId
      };

      // 1. Try Supabase Insert
      const { data, error: supabaseError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      // If successful, data contains the returned row
      setOrderPlaced({
        orderId: data.order_id,
        status: data.status,
        totalAmount: data.total_amount,
        items: data.items,
        createdAt: data.created_at
      });
      clearCart();

    } catch (err) {
      console.warn("Supabase Error, falling back to mock order placement", err);
      // Fallback if Supabase is not running or properly configured
      const newOrder = {
        _id: Math.random().toString(36).substring(7),
        orderId: 'ORD' + Math.floor(10000 + Math.random() * 90000),
        status: 'Pending',
        totalAmount: getCartTotal(),
        items: cart.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        createdAt: new Date().toISOString()
      };
      
      // Save to local storage so Admin panel can see it
      const savedOrders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
      localStorage.setItem('canteen_orders', JSON.stringify([...savedOrders, newOrder]));

      // Deduct stock from local inventory if it exists
      const localInventory = JSON.parse(localStorage.getItem('canteen_inventory') || '[]');
      const updatedInventory = localInventory.map(invItem => {
        // Find if this inventory item matches any menu item ordered (simple match by name for demo purposes)
        const orderedItem = cart.find(c => c.name.toLowerCase().includes(invItem.name.toLowerCase()) || invItem.name.toLowerCase().includes(c.name.toLowerCase()));
        if (orderedItem) {
          // Deduct quantity (assuming 1 unit per order quantity for simplicity)
          return { ...invItem, quantity: Math.max(0, invItem.quantity - orderedItem.quantity) };
        }
        return invItem;
      });
      localStorage.setItem('canteen_inventory', JSON.stringify(updatedInventory));

      setOrderPlaced(newOrder);
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 py-16 text-center"
      >
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Your order has been successfully placed.</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="text-2xl font-bold font-mono tracking-wider">{orderPlaced.orderId}</p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl">
          <span className="font-medium text-gray-600">Amount to pay:</span>
          <span className="text-2xl font-extrabold text-primary">₹{getCartTotal()}</span>
        </div>
        
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Smartphone size={20} />
              </div>
              <input 
                type="text" 
                placeholder="e.g. 9876543210@ybl"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className={`w-full font-bold py-4 rounded-xl text-white transition-all ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg'}`}
          >
            {isProcessing ? 'Processing Payment...' : 'Pay with UPI'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

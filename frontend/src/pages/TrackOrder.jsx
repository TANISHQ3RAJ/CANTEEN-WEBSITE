import React, { useState } from 'react';
import { Search, Package, ChefHat, CheckCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) {
      setError('Please enter a valid Order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // 1. Try Supabase First
      const { data, error: supabaseError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (!supabaseError && data) {
        setOrder({
          orderId: data.order_id,
          status: data.status,
          totalAmount: data.total_amount,
          items: data.items,
          createdAt: data.created_at
        });
      } else {
        // Fallback to local storage if not found in Supabase (or if Supabase is offline)
        throw new Error('Not found in supabase');
      }
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
      const localHistory = JSON.parse(localStorage.getItem('canteen_history') || '[]');
      const allLocal = [...localOrders, ...localHistory];
      const found = allLocal.find(o => o.orderId === orderId);

      if (found) {
        setOrder(found);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepName) => {
    if (!order) return 'pending';
    if (order.status === 'Completed') return 'completed';
    if (order.status === 'Preparing' && stepName === 'Placed') return 'completed';
    if (order.status === 'Preparing' && stepName === 'Preparing') return 'current';
    if (order.status === 'Pending' && stepName === 'Placed') return 'current';
    return 'pending';
  };

  const StepIcon = ({ icon: Icon, status, label }) => {
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';
    const isPending = status === 'pending';

    return (
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
          isCompleted ? 'bg-green-100 text-green-500' :
          isCurrent ? 'bg-primary/10 text-primary border-2 border-primary' :
          'bg-gray-100 text-gray-400'
        }`}>
          <Icon size={28} />
        </div>
        <span className={`font-bold text-sm ${
          isCompleted ? 'text-green-600' :
          isCurrent ? 'text-primary' :
          'text-gray-500'
        }`}>{label}</span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-gray-500">Enter your order ID (e.g., ORD12345) to see real-time updates.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono font-bold text-lg"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-4 font-medium text-center">{error}</p>}
      </div>

      {order && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Order ID</p>
              <h2 className="text-2xl font-mono font-bold">{order.orderId}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium mb-1">Amount</p>
              <h2 className="text-2xl font-bold text-primary">₹{order.totalAmount}</h2>
            </div>
          </div>

          <div className="flex justify-between items-center relative mb-12 px-4 md:px-12">
            {/* Connecting lines */}
            <div className="absolute top-8 left-[10%] right-[10%] h-1 bg-gray-100 -z-10 rounded-full"></div>
            <div className={`absolute top-8 left-[10%] h-1 -z-10 rounded-full transition-all duration-500 ${
              order.status === 'Completed' ? 'w-[80%] bg-green-400' : 
              order.status === 'Preparing' ? 'w-[40%] bg-primary/50' : 
              'w-0'
            }`}></div>

            <StepIcon icon={Package} label="Placed" status={getStepStatus('Placed')} />
            <StepIcon icon={ChefHat} label="Preparing" status={getStepStatus('Preparing')} />
            <StepIcon icon={CheckCircle} label="Ready" status={getStepStatus('Ready')} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-600">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TrackOrder;

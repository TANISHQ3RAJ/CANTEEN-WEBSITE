import React, { useState, useEffect } from 'react';
import { Search, Package, ChefHat, CheckCircle, Truck, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Real-time subscription for the current order
  useEffect(() => {
    if (!order?.orderId) return;

    const subscription = supabase
      .channel(`order_status_${order.orderId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `order_id=eq.${order.orderId}` }, 
        (payload) => {
          console.log("Order updated:", payload.new);
          setOrder(prev => ({
            ...prev,
            status: payload.new.status
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [order?.orderId]);

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
    if (order.status === 'Completed') return 'completed';
    if (order.status === 'Ready') {
      if (stepName === 'Placed' || stepName === 'Preparing') return 'completed';
      if (stepName === 'Ready') return 'current';
    }
    if (order.status === 'Preparing') {
      if (stepName === 'Placed') return 'completed';
      if (stepName === 'Preparing') return 'current';
    }
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
            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Placed On</p>
              <h2 className="text-lg font-bold">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                <span className="block text-xs font-normal text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </h2>
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
              order.status === 'Ready' ? 'w-[80%] bg-blue-400' : 
              order.status === 'Preparing' ? 'w-[40%] bg-primary/50' : 
              'w-0'
            }`}></div>

            <StepIcon icon={Package} label="Placed" status={getStepStatus('Placed')} />
            <StepIcon icon={ChefHat} label="Preparing" status={getStepStatus('Preparing')} />
            <StepIcon icon={CheckCircle} label="Ready" status={getStepStatus('Ready')} />
          </div>

          {/* Cancellation Section - Only for Pending Orders */}
          {order.status === 'Pending' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-1">Want to cancel this order?</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Orders can only be cancelled while they are still pending. A <span className="font-bold">20% penalty (₹{(order.totalAmount * 0.2).toFixed(2)})</span> will be charged.
                  </p>
                  <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-red-200 mb-4">
                    <span className="text-sm font-medium text-red-800">Refund Amount:</span>
                    <span className="text-lg font-black text-red-900">₹{(order.totalAmount * 0.8).toFixed(2)}</span>
                  </div>
                  <CancelButton order={order} onCancelled={() => handleTrack({ preventDefault: () => {} })} />
                </div>
              </div>
            </div>
          )}

          {order.status === 'Cancelled' && (
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 mb-8 text-center">
              <XCircle className="text-gray-400 mx-auto mb-2" size={40} />
              <h3 className="font-bold text-gray-800">This order was cancelled</h3>
              <p className="text-sm text-gray-500">Refund of ₹{(order.totalAmount * 0.8).toFixed(2)} processed (after 20% penalty).</p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-100">
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

          {/* Feedback Section - Only for Completed Orders */}
          {order.status === 'Completed' && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">How was your meal?</h3>
              </div>
              
              <FeedbackForm orderId={order.orderId} />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// Feedback Form Component
const FeedbackForm = ({ orderId }) => {
  const [quality, setQuality] = useState(0);
  const [taste, setTaste] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quality === 0 || taste === 0) {
      alert("Please provide ratings for both Quality and Taste.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([
          { 
            order_id: orderId, 
            quality_rating: quality, 
            taste_rating: taste, 
            comments: comments 
          }
        ]);

      if (error) throw error;
      
      setSubmitted(true);
      // Also save locally for persistence if offline
      const localFeedbacks = JSON.parse(localStorage.getItem('canteen_feedbacks') || '[]');
      localStorage.setItem('canteen_feedbacks', JSON.stringify([...localFeedbacks, { orderId, quality, taste, comments, date: new Date() }]));
    } catch (err) {
      console.error("Error submitting feedback:", err);
      // Fallback to local storage if table doesn't exist
      const localFeedbacks = JSON.parse(localStorage.getItem('canteen_feedbacks') || '[]');
      localStorage.setItem('canteen_feedbacks', JSON.stringify([...localFeedbacks, { orderId, quality, taste, comments, date: new Date() }]));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 p-6 rounded-2xl text-center"
      >
        <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
        <h4 className="font-bold text-green-900 mb-1">Thank you for your feedback!</h4>
        <p className="text-sm text-green-700">Your review helps us improve our service.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality Rating */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Food Quality</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setQuality(star)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  quality >= star ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Taste Rating */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Food Taste</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setTaste(star)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  taste >= star ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Additional Comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Tell us more about your experience..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none min-h-[100px] text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

// Cancel Button Component
const CancelButton = ({ order, onCancelled }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? A 20% penalty will be deducted from your refund.")) {
      return;
    }

    setLoading(true);
    try {
      // 1. Update Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: 'Cancelled' })
        .eq('order_id', order.orderId);

      if (error) throw error;

      // 2. Update Local Storage (all collections)
      const collections = ['canteen_orders', 'canteen_history'];
      collections.forEach(key => {
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = local.map(o => o.orderId === order.orderId ? { ...o, status: 'Cancelled' } : o);
        localStorage.setItem(key, JSON.stringify(updated));
      });

      alert(`Order cancelled successfully. Refund of ₹${(order.totalAmount * 0.8).toFixed(2)} will be processed.`);
      onCancelled();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="w-full py-3 bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? 'Processing...' : (
        <>
          <XCircle size={18} />
          Confirm Cancellation
        </>
      )}
    </button>
  );
};

export default TrackOrder;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime changes in Supabase
    const ordersSubscription = supabase
      .channel('public:kitchen_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 1. Fetch from Supabase
      const { data: sbOrders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      let formattedSb = [];
      if (!error && sbOrders) {
        formattedSb = sbOrders.map(o => ({
          _id: o.id,
          orderId: o.order_id,
          status: o.status,
          totalAmount: o.total_amount,
          items: o.items,
          createdAt: o.created_at
        }));
      }

      // 2. Fetch from Local Storage
      const localOrders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
      
      // 3. Merge (prioritize Supabase if IDs match)
      const allOrders = [...formattedSb];
      localOrders.forEach(lo => {
        const loId = lo.orderId || lo.order_id;
        if (!allOrders.find(so => (so.orderId || so.order_id) === loId)) {
          allOrders.push(lo);
        }
      });

      // Filter out completed and ready ones for the kitchen display
      const activeOrders = allOrders.filter(o => o.status !== 'Completed' && o.status !== 'Ready');
      setOrders(activeOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (order) => {
    let newStatus = order.status;
    if (order.status === 'Pending') newStatus = 'Preparing';
    else if (order.status === 'Preparing') newStatus = 'Ready';

    // Optimistically update UI
    setOrders(prev => prev.map(o => o.orderId === order.orderId ? { ...o, status: newStatus } : o).filter(o => o.status !== 'Completed' && o.status !== 'Ready'));

    // 1. Update Local Storage (always good to have for same-device fallback)
    const localOrders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
    const updatedLocal = localOrders.map(o => o.orderId === order.orderId ? { ...o, status: newStatus } : o);
    localStorage.setItem('canteen_orders', JSON.stringify(updatedLocal));
    
    // 2. Update Supabase
    try {
      const idToUpdate = order._id || order.id;
      if (idToUpdate && (typeof idToUpdate !== 'string' || !idToUpdate.startsWith('ORD'))) {
        await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', idToUpdate);
      } else {
        await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('order_id', order.orderId);
      }
    } catch (err) {
      console.error("Supabase sync failed:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 font-sans bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat size={32} className="text-orange-500" />
            Kitchen Display
          </h1>
          <p className="text-gray-500 mt-1">Real-time order queue</p>
        </div>
        <button onClick={fetchOrders} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-50">
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Pending
          </h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'Pending').map(order => (
              <OrderCard key={order.orderId} order={order} onAdvance={() => advanceStatus(order)} btnText="Start Preparing" btnColor="bg-orange-500 hover:bg-orange-600" />
            ))}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> Preparing
          </h2>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'Preparing').map(order => (
              <OrderCard key={order.orderId} order={order} onAdvance={() => advanceStatus(order)} btnText="Mark Ready" btnColor="bg-blue-500 hover:bg-blue-600" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onAdvance, btnText, btnColor }) => {
  const date = order.createdAt ? new Date(order.createdAt) : new Date();
  const timeStr = isNaN(date.getTime()) ? 'Recently' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <span className="font-mono font-bold text-lg text-gray-900">
          {order.orderId || order.order_id || order.id || order._id || 'N/A'}
        </span>
        <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock size={12}/> {timeStr}</span>
      </div>
      <ul className="mb-4 space-y-1">
        {order.items && Array.isArray(order.items) ? order.items.map((item, idx) => (
          <li key={idx} className="text-sm font-medium text-gray-700 flex justify-between">
            <span>{item.quantity || 1}x {item.name || 'Item'}</span>
          </li>
        )) : <li className="text-sm text-gray-400 italic">No items details</li>}
      </ul>
      <button onClick={onAdvance} className={`w-full py-2 rounded-lg text-white font-bold text-sm transition-colors ${btnColor}`}>
        {btnText}
      </button>
    </motion.div>
  );
};

export default Kitchen;

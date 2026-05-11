import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, ArrowLeft, RefreshCw, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgQuality: 0, avgTaste: 0, total: 0 });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      let data = [];
      
      // Try Supabase first
      const { data: sbData, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && sbData) {
        data = sbData;
      } else {
        // Fallback to local storage
        data = JSON.parse(localStorage.getItem('canteen_feedbacks') || '[]');
        // Sort local by date descending
        data.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
      }

      setFeedbacks(data);
      calculateStats(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ avgQuality: 0, avgTaste: 0, total: 0 });
      return;
    }
    const totalQuality = data.reduce((sum, f) => sum + (f.quality_rating || f.quality), 0);
    const totalTaste = data.reduce((sum, f) => sum + (f.taste_rating || f.taste), 0);
    setStats({
      avgQuality: (totalQuality / data.length).toFixed(1),
      avgTaste: (totalTaste / data.length).toFixed(1),
      total: data.length
    });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const clearFeedbacks = () => {
    if (window.confirm("Are you sure you want to clear ALL feedback records locally? (Supabase data will remain if connected)")) {
      localStorage.removeItem('canteen_feedbacks');
      fetchFeedbacks();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <a href="/admin" className="flex items-center gap-2 text-primary font-bold mb-2 hover:underline">
            <ArrowLeft size={16} /> Back to Dashboard
          </a>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <MessageSquare size={32} className="text-primary" />
            Customer Feedback
          </h1>
          <p className="text-gray-500">Real-time reviews and ratings from your customers</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={clearFeedbacks}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
          >
            <Trash2 size={18} /> Clear Local
          </button>
          <button 
            onClick={fetchFeedbacks}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Average Quality</span>
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-gray-900">{stats.avgQuality}</span>
            <span className="text-gray-400 mb-1 font-bold">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Average Taste</span>
            <Star className="text-orange-400 fill-orange-400" size={20} />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-gray-900">{stats.avgTaste}</span>
            <span className="text-gray-400 mb-1 font-bold">/ 5.0</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Reviews</span>
            <MessageSquare className="text-blue-500" size={20} />
          </div>
          <span className="text-4xl font-black text-gray-900">{stats.total}</span>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw size={40} className="animate-spin text-gray-200" />
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No feedback received yet.</p>
          </div>
        ) : (
          feedbacks.map((f, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={f.id || i} 
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold font-mono">
                    {f.order_id || f.orderId}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(f.created_at || f.date).toLocaleDateString()} at {new Date(f.created_at || f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-800 font-medium italic">"{f.comments || 'No written comments.'}"</p>
              </div>
              
              <div className="flex gap-4">
                <div className="text-center bg-yellow-50 px-4 py-2 rounded-2xl min-w-[80px]">
                  <p className="text-[10px] font-bold text-yellow-600 uppercase mb-1">Quality</p>
                  <p className="text-xl font-black text-yellow-700">{f.quality_rating || f.quality}<span className="text-xs text-yellow-500 opacity-50 ml-0.5">/5</span></p>
                </div>
                <div className="text-center bg-orange-50 px-4 py-2 rounded-2xl min-w-[80px]">
                  <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Taste</p>
                  <p className="text-xl font-black text-orange-700">{f.taste_rating || f.taste}<span className="text-xs text-orange-500 opacity-50 ml-0.5">/5</span></p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;

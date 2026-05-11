import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, CheckCircle, Clock, ShoppingBag, PackageCheck, Lock, Eye, EyeOff, LogOut, ShieldCheck, Archive, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Credentials (frontend guard — workshop use only) ──────────
const ADMIN_USERNAME = 'TANISHQ3RAJ';
const ADMIN_PASSWORD = 'Tanijune.3.';
const SESSION_KEY    = 'canteen_admin_auth';

// ── Login Screen ─────────────────────────────────────────────
const AdminLogin = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [shaking,  setShaking]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error: sbError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (sbError || !data) {
        // Fallback to hardcoded credentials if database check fails (for initial setup)
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          onSuccess();
          return;
        }
        throw new Error('Invalid username or password.');
      }

      sessionStorage.setItem(SESSION_KEY, 'true');
      onSuccess();
    } catch (err) {
      setError(err.message);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#F7F2EB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        width: '100%', maxWidth: 420,
        animation: shaking ? 'shake 0.4s ease' : 'none'
      }}>
        {/* Lock icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: '#fff0ee', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 24px'
        }}>
          <ShieldCheck size={32} color="#E84025" />
        </div>

        <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px' }}>
          Admin Access
        </h1>
        <p style={{ textAlign: 'center', color: '#999', fontSize: 14, margin: '0 0 32px' }}>
          Enter your credentials to continue
        </p>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, letterSpacing: 0.5 }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              autoComplete="off"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12,
                border: error ? '2px solid #E84025' : '2px solid #eee',
                fontSize: 15, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit', transition: 'border 0.2s',
                letterSpacing: 1
              }}
              onFocus={e => { if (!error) e.target.style.border = '2px solid #E84025'; }}
              onBlur={e  => { if (!error) e.target.style.border = '2px solid #eee'; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 8, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, letterSpacing: 0.5 }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                style={{
                  width: '100%', padding: '12px 48px 12px 16px', borderRadius: 12,
                  border: error ? '2px solid #E84025' : '2px solid #eee',
                  fontSize: 15, outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'inherit', transition: 'border 0.2s'
                }}
                onFocus={e => { if (!error) e.target.style.border = '2px solid #E84025'; }}
                onBlur={e  => { if (!error) e.target.style.border = '2px solid #eee'; }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: '#E84025', fontSize: 13, marginBottom: 16, marginTop: 8, fontWeight: 600 }}>
              ✕ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', marginTop: error ? 0 : 24,
              background: loading ? '#ccc' : '#E84025', color: '#fff', border: 'none',
              borderRadius: 12, fontSize: 16, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => !loading && (e.target.style.background = '#c73520')}
            onMouseLeave={e => !loading && (e.target.style.background = '#E84025')}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};



const OrderTable = ({ orders, onMarkDone, showAction = true }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="p-4 font-semibold text-gray-600">Order ID</th>
            <th className="p-4 font-semibold text-gray-600">Items</th>
            <th className="p-4 font-semibold text-gray-600">Total</th>
            <th className="p-4 font-semibold text-gray-600">Status</th>
            {showAction && <th className="p-4 font-semibold text-gray-600 text-right">Action</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={showAction ? 5 : 4} className="p-8 text-center text-gray-400 text-sm">
                No orders here yet.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id || order.id || order.order_id || order.orderId || Math.random()} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-medium text-gray-800">
                  {order.orderId || order.order_id || order._id || order.id || 'N/A'}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {order.items && Array.isArray(order.items) 
                    ? order.items.map(item => `${item.quantity || 1}x ${item.name || 'Item'}`).join(', ') 
                    : 'No items'}
                </td>
                <td className="p-4 font-bold text-gray-900">
                  ₹{order.totalAmount || order.total_amount || order.amount || order.total || 0}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {order.status}
                  </span>
                </td>
                  {showAction && (
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onMarkDone(order._id || order.orderId)}
                        disabled={order.status !== 'Ready'}
                        className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ${
                          order.status === 'Ready' 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        title={order.status !== 'Ready' ? "Waiting for kitchen to mark as Ready" : "Click to complete order"}
                      >
                        {order.status === 'Ready' ? '✓ Mark Done' : 'Waiting...'}
                      </button>
                    </td>
                  )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Admin = () => {
  const [orders,    setOrders]    = useState(() => JSON.parse(localStorage.getItem('canteen_orders') || '[]'));
  const [loading,   setLoading]   = useState(true);
  const [authed,    setAuthed]    = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
  const [historyOrders, setHistoryOrders] = useState(() => JSON.parse(localStorage.getItem('canteen_history') || '[]'));

  // Persist history and orders to localStorage
  useEffect(() => {
    localStorage.setItem('canteen_history', JSON.stringify(historyOrders));
  }, [historyOrders]);

  useEffect(() => {
    localStorage.setItem('canteen_orders', JSON.stringify(orders));
  }, [orders]);

  // Clear completed orders to history every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        const completed = prevOrders.filter(o => o.status === 'Completed');
        const others = prevOrders.filter(o => o.status !== 'Completed');
        if (completed.length > 0) {
          setHistoryOrders(prevHistory => [...prevHistory, ...completed]);
        }
        return others;
      });
    }, 10 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  // If not authenticated, show login screen
  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to delete ALL orders? This cannot be undone.")) {
      setOrders([]);
      setHistoryOrders([]);
      localStorage.removeItem('canteen_orders');
      localStorage.removeItem('canteen_history');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map snake_case back to camelCase for the frontend UI
        const formattedOrders = data.map(o => {
          // Robustly identify ID and Amount from whatever Supabase returns
          const resolvedId = o.order_id || o.orderId || o.id || o._id;
          const resolvedAmount = o.total_amount || o.totalAmount || o.amount || o.total || 0;
          
          return {
            ...o, // Keep original properties as backup
            _id: o.id || o._id,
            orderId: resolvedId,
            status: o.status,
            totalAmount: resolvedAmount,
            items: o.items,
            createdAt: o.created_at || o.createdAt,
            upiRef: o.upi_ref || o.upiRef
          };
        });
        setOrders(formattedOrders);
      } else {
        // Use local storage fallback if Supabase table is empty or fails
        const local = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
        if (local.length > 0) setOrders(local);
      }
    } catch (error) {
      console.error("Supabase unavailable. Proceeding with local storage data.", error);
      const local = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
      setOrders(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime changes in Supabase
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchOrders(); // Just refetch all on any change for simplicity
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, []);

  const markDone = async (id) => {
    // Optimistic update FIRST — update local state immediately
    setOrders(prev => prev.map(o => o._id === id || o.orderId === id ? { ...o, status: 'Completed' } : o));

    try {
      // If we have a proper numeric/uuid id from supabase
      if (id && typeof id !== 'string' || (typeof id === 'string' && !id.startsWith('ORD'))) {
        await supabase
          .from('orders')
          .update({ status: 'Completed' })
          .eq('id', id);
      } else {
        // Fallback for local storage orders that just have orderId (ORDXXXXX)
        const localOrders = JSON.parse(localStorage.getItem('canteen_orders') || '[]');
        const updated = localOrders.map(o => o.orderId === id || o._id === id ? { ...o, status: 'Completed' } : o);
        localStorage.setItem('canteen_orders', JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Could not sync with Supabase, status saved locally:", error);
    }
  };

  const pendingOrders = orders.filter(o => o.status !== 'Completed');
  const completedOrders = orders.filter(o => o.status === 'Completed');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-semibold text-gray-700">{ADMIN_USERNAME}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearAllData}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium text-red-600 border border-red-100"
          >
            <Trash2 size={16} />
            Clear Data
          </button>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-orange-500' : ''} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium text-red-600 border border-red-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Admin Modules Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <a href="/inventory" className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
          <PackageCheck size={24} className="text-blue-500" />
          <span className="font-semibold text-sm">Inventory</span>
        </a>
        <a href="/kitchen" className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
          <Clock size={24} className="text-orange-500" />
          <span className="font-semibold text-sm">Kitchen</span>
        </a>
        <a href="/billing" className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
          <CheckCircle size={24} className="text-green-500" />
          <span className="font-semibold text-sm">Billing</span>
        </a>
        <a href="/vendors" className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
          <Lock size={24} className="text-purple-500" />
          <span className="font-semibold text-sm">Vendors</span>
        </a>
        <a href="/reports" className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
          <Eye size={24} className="text-indigo-500" />
          <span className="font-semibold text-sm">Reports</span>
        </a>
        <a href="/feedback" className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow">
          <MessageSquare size={24} className="text-primary" />
          <span className="font-semibold text-sm">Feedback</span>
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <ShoppingBag size={22} className="text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-orange-600 font-medium">Pending Orders</p>
            <p className="text-3xl font-bold text-orange-700">{pendingOrders.length}</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <PackageCheck size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">Completed Orders</p>
            <p className="text-3xl font-bold text-green-700">{completedOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Orders Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Pending Orders</h2>
          {pendingOrders.length > 0 && (
            <span className="ml-1 px-2.5 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
              {pendingOrders.length}
            </span>
          )}
        </div>
        <OrderTable orders={pendingOrders} onMarkDone={markDone} showAction={true} />
      </div>

      {/* Completed Orders Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={18} className="text-green-500" />
          <h2 className="text-xl font-bold text-gray-800">Completed Orders</h2>
          {completedOrders.length > 0 && (
            <span className="ml-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              {completedOrders.length}
            </span>
          )}
        </div>
        <OrderTable orders={completedOrders} showAction={false} />
      </div>

      {/* History Orders Section */}
      {historyOrders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Archive size={18} className="text-gray-500" />
            <h2 className="text-xl font-bold text-gray-800">History of Orders</h2>
            <span className="ml-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
              {historyOrders.length}
            </span>
          </div>
          <OrderTable orders={historyOrders} showAction={false} />
        </div>
      )}
    </div>
  );
};

export default Admin;

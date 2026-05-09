import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const Reports = () => {
  const [data, setData] = useState({ todaySales: 0, todayOrderCount: 0, lowStockAlerts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking real-time dashboard data by aggregating from localStorage
    const localOrders = JSON.parse(localStorage.getItem('canteen_history') || '[]');
    const localInventory = JSON.parse(localStorage.getItem('canteen_inventory') || '[]');
    
    const todayOrders = localOrders; // In a real app, filter by today's date
    const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const lowStockAlerts = localInventory.filter(i => i.quantity <= i.threshold);

    setData({ todaySales, todayOrderCount: todayOrders.length, lowStockAlerts });
    setLoading(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 size={28} className="text-blue-600" />
          Real-Time Reporting
        </h1>
        <p className="text-gray-500 mt-1">Live dashboard of canteen operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingUp size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Today's Revenue</p>
            <p className="text-3xl font-black text-gray-900">₹{data.todaySales.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <BarChart3 size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Orders</p>
            <p className="text-3xl font-black text-gray-900">{data.todayOrderCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Low Stock Items</p>
            <p className="text-3xl font-black text-gray-900">{data.lowStockAlerts.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-500" />
          Inventory Alerts
        </h2>
        {data.lowStockAlerts.length === 0 ? (
          <p className="text-gray-500">All inventory items are well-stocked.</p>
        ) : (
          <ul className="space-y-3">
            {data.lowStockAlerts.map(item => (
              <li key={item._id} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-xl">
                <span className="font-bold text-red-900">{item.name}</span>
                <span className="text-sm font-medium text-red-700 bg-red-200 px-2 py-1 rounded-lg">
                  {item.quantity} {item.unit} left (Threshold: {item.threshold})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reports;

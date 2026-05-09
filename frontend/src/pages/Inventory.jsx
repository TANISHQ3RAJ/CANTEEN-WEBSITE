import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', quantity: 0, unit: 'kg', threshold: 10 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('inventory_items').select('*');
      if (error) throw error;
      setItems(data || []);
      localStorage.setItem('canteen_inventory', JSON.stringify(data || []));
    } catch (err) {
      console.error("Error fetching inventory. Falling back to local storage.", err);
      const local = JSON.parse(localStorage.getItem('canteen_inventory') || '[]');
      setItems(local);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('inventory_items').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('inventory_items').insert([formData]);
        if (error) throw error;
      }
      fetchInventory();
      setShowForm(false);
      setFormData({ name: '', category: '', quantity: 0, unit: 'kg', threshold: 10 });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving inventory item, using local storage", err);
      let local = JSON.parse(localStorage.getItem('canteen_inventory') || '[]');
      if (editingId) {
        local = local.map(i => i.id === editingId ? { ...i, ...formData } : i);
      } else {
        local.push({ id: Date.now().toString(), ...formData, lastUpdated: new Date() });
      }
      localStorage.setItem('canteen_inventory', JSON.stringify(local));
      setItems(local);
      setShowForm(false);
      setFormData({ name: '', category: '', quantity: 0, unit: 'kg', threshold: 10 });
      setEditingId(null);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, threshold: item.threshold });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error("Error deleting, using local storage fallback", err);
      let local = JSON.parse(localStorage.getItem('canteen_inventory') || '[]');
      local = local.filter(i => i._id !== id);
      localStorage.setItem('canteen_inventory', JSON.stringify(local));
      setItems(local);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package size={28} className="text-primary" />
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage your raw materials</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', category: '', quantity: 0, unit: 'kg', threshold: 10 }); }}
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Item' : 'New Item'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">ITEM NAME</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">CATEGORY</label>
              <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">QUANTITY</label>
              <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">UNIT</label>
              <input type="text" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">LOW THRESHOLD</label>
              <input type="number" value={formData.threshold} onChange={e => setFormData({ ...formData, threshold: Number(e.target.value) })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-5 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">{editingId ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">Item</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Category</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Stock Level</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const isLow = item.quantity <= item.threshold;
                return (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{item.category}</td>
                    <td className="p-4 font-bold text-gray-800">
                      {item.quantity} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                    </td>
                    <td className="p-4">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          <AlertTriangle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          Good
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )
              })}
              {items.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No inventory items found. Add one above!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;

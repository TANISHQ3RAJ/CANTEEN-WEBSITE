import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', phone: '', paymentStatus: 'Paid' });

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('canteen_vendors') || '[]');
    setVendors(local);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVendor = { _id: Date.now().toString(), ...formData };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    localStorage.setItem('canteen_vendors', JSON.stringify(updated));
    setShowForm(false);
    setFormData({ name: '', contactPerson: '', phone: '', paymentStatus: 'Paid' });
  };

  const handleDelete = (id) => {
    const updated = vendors.filter(v => v._id !== id);
    setVendors(updated);
    localStorage.setItem('canteen_vendors', JSON.stringify(updated));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={28} className="text-purple-500" />
            Vendor Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your suppliers and payments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-90">
          <Plus size={20} /> Add Vendor
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">New Vendor</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">VENDOR/COMPANY NAME</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">CONTACT PERSON</label>
              <input type="text" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">PHONE</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">PAYMENT STATUS</label>
              <select value={formData.paymentStatus} onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500">
                <option value="Paid">Paid</option>
                <option value="Due">Due</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-opacity-90">Save</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600 text-sm">Vendor</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Contact Person</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Phone</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Payment Status</th>
              <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900">{vendor.name}</td>
                <td className="p-4 text-gray-600 text-sm">{vendor.contactPerson || '-'}</td>
                <td className="p-4 text-gray-600 text-sm">{vendor.phone}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    vendor.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                    vendor.paymentStatus === 'Due' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {vendor.paymentStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(vendor._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No vendors added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendors;

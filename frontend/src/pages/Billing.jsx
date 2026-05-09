import React, { useState, useEffect } from 'react';
import { Receipt, Printer } from 'lucide-react';
import axios from 'axios';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, generate mock bills from completed orders in localStorage since the full backend bill generation isn't hooked into the checkout flow fully (due to local fallback)
    const localOrders = JSON.parse(localStorage.getItem('canteen_history') || '[]');
    const generatedBills = localOrders.map(order => {
      const subtotal = order.totalAmount;
      const gstAmount = (subtotal * 0.18);
      return {
        _id: 'BILL' + order.orderId,
        orderId: order.orderId,
        subtotal: subtotal,
        gstRate: 18,
        gstAmount: gstAmount,
        grandTotal: subtotal + gstAmount,
        paymentMethod: 'Online',
        createdAt: order.createdAt || new Date().toISOString()
      }
    });
    setBills(generatedBills);
    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt size={28} className="text-blue-500" />
            Billing System
          </h1>
          <p className="text-gray-500 mt-1">Manage receipts and GST</p>
        </div>
        <button onClick={handlePrint} className="bg-gray-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <Printer size={20} /> Print All
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600 text-sm">Bill ID / Order</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Subtotal</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">GST (18%)</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Grand Total</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{bill.orderId}</td>
                <td className="p-4 text-gray-600 text-sm">{new Date(bill.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-gray-600 text-sm">₹{bill.subtotal.toFixed(2)}</td>
                <td className="p-4 text-gray-600 text-sm">₹{bill.gstAmount.toFixed(2)}</td>
                <td className="p-4 font-bold text-gray-900">₹{bill.grandTotal.toFixed(2)}</td>
                <td className="p-4">
                  <button onClick={handlePrint} className="text-blue-600 font-bold text-sm hover:underline">Print</button>
                </td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No generated bills yet. Complete an order to generate a bill.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;

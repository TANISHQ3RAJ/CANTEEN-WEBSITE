const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Get all bills
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('bills').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate a bill for an order
router.post('/', async (req, res) => {
  try {
    const { data: order, error: orderError } = await supabase.from('orders').select('*').eq('id', req.body.orderId).single();
    if (orderError || !order) return res.status(404).json({ message: 'Order not found' });

    const gstRate = req.body.gstRate || 18;
    const subtotal = order.total_amount;
    const gstAmount = (subtotal * gstRate) / 100;
    const grandTotal = subtotal + gstAmount;

    const billData = {
      order_id: order.id,
      subtotal,
      gst_rate: gstRate,
      gst_amount: gstAmount,
      grand_total: grandTotal,
      payment_method: req.body.paymentMethod || 'Online'
    };

    const { data: newBill, error: billError } = await supabase.from('bills').insert([billData]).select();
    if (billError) throw billError;
    res.status(201).json(newBill[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

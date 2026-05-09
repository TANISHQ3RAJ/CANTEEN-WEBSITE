const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').insert([req.body]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').update({ status: req.body.status }).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

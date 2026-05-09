const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inventory_items').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new inventory item
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inventory_items').insert([req.body]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('inventory_items').update(req.body).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('inventory_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

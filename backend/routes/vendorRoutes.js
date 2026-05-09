const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('vendors').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new vendor
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('vendors').insert([req.body]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('vendors').update(req.body).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete vendor
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('vendors').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new menu item
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').insert([req.body]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a menu item
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').update(req.body).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('menu_items').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Deleted Menu Item' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

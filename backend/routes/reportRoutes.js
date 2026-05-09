const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Get real-time dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data: todayOrders, error: orderError } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', startOfDay.toISOString());

    if (orderError) throw orderError;

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const todayOrderCount = todayOrders.length;

    const { data: lowStockItems, error: stockError } = await supabase
      .from('inventory_items')
      .select('*');
    
    if (stockError) throw stockError;

    const lowStockAlerts = lowStockItems.filter(item => item.quantity <= item.threshold);

    res.json({
      todaySales,
      todayOrderCount,
      lowStockAlerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

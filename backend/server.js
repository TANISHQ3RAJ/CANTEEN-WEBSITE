require('dotenv').config();
const express = require('express');
const { supabase } = require('./lib/supabase');
const cors = require('cors');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const billingRoutes = require('./routes/billingRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Supabase is initialized in lib/supabase.js
console.log('Backend server starting with Supabase integration...');


app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('JIET Canteen API is running...');
});

// Seed logic can be handled via Supabase SQL or migration scripts if needed


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

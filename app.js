const express = require('express');
const morgan = require('morgan');
const produkRoutes = require('./routes/produkRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// Routes
app.use('/api/v1/produk', produkRoutes);
app.use('/api/v1/order', orderRoutes);

// 4. SERVER
module.exports = app;

const express = require('express');
const morgan = require('morgan');
const produkRoutes = require('./routes/produkRoutes');

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// Routes
app.use('/api/v1/produk', produkRoutes);

// 4. SERVER
module.exports = app;

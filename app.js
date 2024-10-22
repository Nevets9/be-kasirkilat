const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const produkRoutes = require('./routes/produkRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const userRoutes = require('./routes/userRoutes');
const tokoRoutes = require('./routes/tokoRoutes');
const path = require('path')

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

// Tambahkan ini untuk melayani file statis
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/produk', produkRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/coupon', couponRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/toko', tokoRoutes);

// 4. SERVER
module.exports = app;

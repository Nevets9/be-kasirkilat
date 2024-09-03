const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    order_date: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled'],
      default: 'pending',
    },
    total_price: {
      type: Number,
      required: [true, 'Total harga wajib diisi'],
    },
    order_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
      },
    ],
    payment_method: {
      type: String,
      enum: ['cash', 'e_wallet', 'bank_transfer'],
      required: [true, 'Metode pembayaran wajib diisi'],
    },
    tax: {
      type: Number,
      required: [true, 'Pajak wajib diisi'],
      default: 0.11,
    },
    coupon: {
      type: String,
      default: null,
    },
    discount_amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

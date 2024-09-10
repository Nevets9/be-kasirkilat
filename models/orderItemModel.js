const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    // order_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Order',
    //   required: true,
    // },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produk',
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Jumlah produk wajib diisi'],
    },
    product_price: {
      type: Number,
      required: [true, 'Harga produk wajib diisi'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    kodeCoupon: {
      type: String,
      required: [true, 'Kode Coupon wajib diisi'],
    },
    awalCoupon: {
      type: Date,
      required: [true, 'Tanggal Awal Coupon wajib diisi'],
    },
    akhirCoupon: {
      type: Date,
      required: [true, 'Tanggal Akhir Coupon wajib diisi'],
    },
    besarDiscount: {
      type: Number,
      required: [true, 'Besar Coupon wajib diisi'],
    },
    deskripsi: {
      type: String
    },
    payment_method: {
      type: String,
      enum: ['cash', 'e_wallet', 'bank_transfer'],
      required: [true, 'Metode pembayaran wajib diisi'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);

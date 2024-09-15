const mongoose = require('mongoose');
const slugify = require('slugify');

const produkSchema = new mongoose.Schema(
  {
    nama_produk: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
    },
    harga_produk: {
      type: Number,
      required: [true, 'Harga produk wajib diisi'],
    },
    stok_produk: {
      type: Number,
      required: [true, 'Stok produk wajib diisi'],
    },
    tipe_produk: {
      type: String,
      enum: ['makanan', 'minuman', 'snack'],
      required: [true, 'Tipe produk wajib diisi'],
    },
    slug_produk: {
      type: String,
      unique: true,
    },
    gambar_produk: { type: String },
  },
  { timestamps: true }
);

produkSchema.pre('save', function (next) {
  this.slug_produk = slugify(this.nama_produk, {
    lower: true,
  });
  next();
});

module.exports = mongoose.model('Produk', produkSchema);

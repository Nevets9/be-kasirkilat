const mongoose = require('mongoose');

const tokoSchema = new mongoose.Schema({
  namaToko: {
    type: String,
    required: [true, 'Nama Toko Wajib Diisi'],
    default: 'Kasir Kilat',
  },
});

const Toko = mongoose.model('Toko', tokoSchema);
module.exports = Toko;

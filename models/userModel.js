const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama Wajib Diisi'],
  },
  nomorPegawai: {
    type: String,
    unique: true,
    required: [true, 'Nomor Pegawai Wajib Diisi'],
  },
  password: {
    type: String,
    required: [true, 'Password Wajib Diisi'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: [true, 'Role Wajib Diisi'],
  },
  lastActive: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

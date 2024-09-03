const Produk = require('../models/produkModel');

exports.createProduk = async (req, res) => {
  try {
    console.log(req.body);
    const newProduk = await Produk.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        produk: newProduk,
      },
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// READ semua produk
exports.getAllProduk = async (req, res) => {
  try {
    const produk = await Produk.find();
    res.json({
      status: 'success',
      result: produk.length,
      data: { produk },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// READ produk by ID
exports.getProdukById = async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);
    if (!produk) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }
    res.status(200).json({
      status: 'success',
      data: { produk },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// UPDATE produk by ID
exports.updateProduk = async (req, res) => {
  try {
    const produk = await Produk.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!produk) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        produk,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// DELETE produk by ID
exports.deleteProduk = async (req, res) => {
  try {
    const produk = await Produk.findByIdAndDelete(req.params.id);
    if (!produk) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Produk tidak ditemukan' });
    }
    res.status(204).send({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

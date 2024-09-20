const Toko = require('../models/tokoModel');

exports.getAllToko = async (req, res) => {
  try {
    const toko = await Toko.find();
    res.json({
      status: 'success',
      result: toko.length,
      data: { toko },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateToko = async (req, res) => {
  try {
    const toko = await Toko.find().updateOne(req.body);
    const tokoData = await Toko.find();
    res.status(200).json({
      status: 'success update',
      data: {
        tokoData,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

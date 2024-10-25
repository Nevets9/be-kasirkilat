const Coupon = require('../models/couponModel');

exports.getAllCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.find();
    res.json({
      status: 'success',
      result: coupon.length,
      data: { coupon },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        coupon: newCoupon,
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

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Coupon tidak ditemukan' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        coupon,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
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

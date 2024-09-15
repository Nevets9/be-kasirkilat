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

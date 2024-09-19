const express = require('express');
const couponController = require('../controller/couponController');

const router = express.Router();

router
  .route('/')
  .get(couponController.getAllCoupon)
  .post(couponController.createCoupon);

router
  .route('/:id')
  .delete(couponController.deleteCoupon);

module.exports = router;

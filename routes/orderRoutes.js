const express = require('express');
const orderController = require('../controller/orderController');

const router = express.Router();

router
  .route('/')
  .post(orderController.createOrder)
  .get(orderController.getAllOrders);

router.route('/statistics').get(orderController.getAllStatistics);
router.route('/statistics/pendapatan').get(orderController.getAllPendapatan);
router.route('/statistics/pelanggan').get(orderController.getAllPelanggan);
router.route('/statistics/popularMenu/:mon').get(orderController.getPopularMenu);

module.exports = router;

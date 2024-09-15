const express = require('express');
const orderController = require('../controller/orderController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/produk:
 *   post:
 *     summary: Membuat pesanan baru
 *     url: aw
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               payment_method:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pesanan berhasil dibuat
 *       400:
 *         description: Terjadi kesalahan
 *   get:
 *     summary: Mendapatkan semua pesanan
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Daftar semua pesanan
 *       400:
 *         description: Terjadi kesalahan
 */

router
  .route('/')
  .post(orderController.createOrder)
  .get(orderController.getAllOrders);

// router
//   .route('/:id')
//   .get(orderController.getOrderById)
//   .patch(orderController.updateOrder)
//   .delete(orderController.deleteOrder);

module.exports = router;

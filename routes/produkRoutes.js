const express = require('express');
const produkController = require('../controller/produkController');

const router = express.Router();

router
  .route('/')
  .get(produkController.getAllProduk)
  .post(produkController.createProduk);
router
  .route('/:id')
  .get(produkController.getProdukById)
  .patch(produkController.updateProduk)
  .delete(produkController.deleteProduk);

module.exports = router;

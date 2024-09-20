const express = require('express');
const tokoController = require('../controller/tokoController');

const router = express.Router();

router
  .route('/')
  .get(tokoController.getAllToko)
  .patch(tokoController.updateToko);

module.exports = router;

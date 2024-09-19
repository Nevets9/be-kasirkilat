const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.loginUser);

router.route('/create').post(authController.createUser);

module.exports = router;
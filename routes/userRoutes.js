const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/').get(authController.getAllUser).post(authController.loginUser);

router
  .route('/:id')
  .get(authController.getUserById)
  .patch(authController.updateUser)
  .delete(authController.deleteUser);

router.route('/create').post(authController.createUser);

module.exports = router;

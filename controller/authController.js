const User = require('../models/userModel');

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      status: 'success',
      result: users.length,
      data: { users },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nama, nomorPegawai, password, role } = req.body;
    const newUser = new User({ nama, nomorPegawai, password, role });
    await newUser.save();
    res.status(201).json({
      status: 'success create user',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { nomorPegawai, password } = req.body;
    const user = await User.findOne({ nomorPegawai });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nomor Pegawai or Password is incorrect',
      });
    }

    if (password != user.password) {
      return res.status(404).json({
        status: 'fail',
        message: 'Nomor Pegawai or Password is incorrect',
      });
    }

    if (user.role == 'admin') {
      res.status(200).json({
        message: 'Login successful',
        data: {
          user: user,
        },
      });
    } else if (user.role == 'user') {
      res.status(200).json({
        message: 'Login successful',
        data: {
          user: user,
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

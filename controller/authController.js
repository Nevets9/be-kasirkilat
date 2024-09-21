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

    user.lastActive = Date.now();
    await user.save();

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Nomor Pegawai or Password is incorrect',
      });
    }

    if (password != user.password) {
      return res.status(401).json({
        status: 'fail',
        message: 'Nomor Pegawai or Password is incorrect',
      });
    }

    res.status(200).json({
      message: 'Login successful',
      data: {
        user: user,
        jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcyNjc2NDU0OSwiaWF0IjoxNzI2NzY0NTQ5fQ.hh9Xx59O9l5U0gHOmFIt7xLCW6NK4-EYNLj2AeyPwNA',
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'User tidak ditemukan' });
    }
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
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

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { registerNumber, password, name, mobileNumber, email, defaultLocation, classSectionId, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ registerNumber, password: hashed, name, mobileNumber, email, defaultLocation, classSectionId, role });
    res.status(201).json({ id: user._id, registerNumber: user.registerNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { registerNumber, password } = req.body;
    const user = await User.findOne({ registerNumber });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }, 'name registerNumber email');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const express = require('express');
const router = express.Router();
const { register, login, getTeachers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.post('/register', register);
router.post('/login', login);
router.get('/teachers', protect, adminOnly, getTeachers);
module.exports = router;
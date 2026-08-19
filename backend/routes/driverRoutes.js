const express = require('express');
const router = express.Router();
const {
    createDriver,
    getAllDrivers,
    markDriverAttendance,
    getTodayDriverAttendance
} = require('../controllers/driverController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, createDriver);
router.get('/', protect, adminOnly, getAllDrivers);
router.post('/attendance', protect, adminOnly, markDriverAttendance);
router.get('/attendance/today', protect, adminOnly, getTodayDriverAttendance);
module.exports = router;
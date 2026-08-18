 const express = require('express');
 const router = express.Router();
 const {
     markAttendance,
     getTodayAttendance
 } = require('../controllers/attendanceController');
 const {
     protect
 } = require('../middleware/authMiddleware');
 router.post('/mark', protect, markAttendance);
 router.get('/today', protect, getTodayAttendance);
 module.exports = router;
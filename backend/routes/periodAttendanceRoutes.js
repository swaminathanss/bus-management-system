 const express = require('express');
 const router = express.Router();
 const {
     markPeriodAttendance,
     getTodayPeriods
 } = require('../controllers/periodAttendanceController');
 const {
     protect
 } = require('../middleware/authMiddleware');
 router.post('/mark', protect, markPeriodAttendance);
 router.get('/today', protect, getTodayPeriods);
 module.exports = router;
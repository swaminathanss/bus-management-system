const express = require('express');
const router = express.Router();
const {
    openWindow,
    getMyActiveWindow
} = require('../controllers/attendanceWindowController');
const {
    protect
} = require('../middleware/authMiddleware');
router.post('/', protect, openWindow);
router.get('/active', protect, getMyActiveWindow);
module.exports = router;
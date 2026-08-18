const express = require('express');
const router = express.Router();
const {
    generateAllocation,
    getTodayAllocation,
    getMyBus
} = require('../controllers/allocationController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/generate', protect, adminOnly, generateAllocation);
router.get('/today', protect, adminOnly, getTodayAllocation);
router.get('/my-bus', protect, getMyBus);
module.exports = router;
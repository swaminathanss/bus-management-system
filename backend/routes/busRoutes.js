const express = require('express');
const router = express.Router();
const {
    createBus,
    getAllBuses,
    getBusById,
    updateBus,
    deleteBus
} = require('../controllers/busController');
const {
    addFuelLog,
    getFuelLogs,
    getFuelSummary
} = require('../controllers/fuelLogController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, createBus);
router.get('/', protect, getAllBuses);
router.get('/:id', protect, getBusById);
router.put('/:id', protect, adminOnly, updateBus);
router.delete('/:id', protect, adminOnly, deleteBus);
router.post('/:id/fuel-log', protect, adminOnly, addFuelLog);
router.get('/:id/fuel-log', protect, adminOnly, getFuelLogs);
router.get('/:id/fuel-log/summary', protect, adminOnly, getFuelSummary);
module.exports = router;
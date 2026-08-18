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
     protect,
     adminOnly
 } = require('../middleware/authMiddleware');
 router.post('/', protect, adminOnly, createBus);
 router.get('/', protect, getAllBuses);
 router.get('/:id', protect, getBusById);
 router.put('/:id', protect, adminOnly, updateBus);
 router.delete('/:id', protect, adminOnly, deleteBus);
 module.exports = router;
const express = require('express');
const router = express.Router();
const {
    requestLocationChange,
    raiseEmergencyTicket,
    getAllTickets,
    reviewTicket
} = require('../controllers/ticketController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/location-change', protect, requestLocationChange);
router.post('/emergency', protect, raiseEmergencyTicket);
router.get('/emergency', protect, adminOnly, getAllTickets);
router.patch('/emergency/:id', protect, adminOnly, reviewTicket);
module.exports = router;
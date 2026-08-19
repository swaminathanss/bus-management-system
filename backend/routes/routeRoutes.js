const express = require('express');
const router = express.Router();
const {
    createRoute,
    getAllRoutes,
    updateRoute
} = require('../controllers/routeController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, createRoute);
router.get('/', protect, getAllRoutes);
router.put('/:id', protect, adminOnly, updateRoute);
module.exports = router;
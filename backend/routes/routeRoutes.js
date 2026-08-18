 const express = require('express');
 const router = express.Router();
 const {
     createRoute,
     getAllRoutes
 } = require('../controllers/routeController');
 const {
     protect,
     adminOnly
 } = require('../middleware/authMiddleware');
 router.post('/', protect, adminOnly, createRoute);
 router.get('/', protect, getAllRoutes);
 module.exports = router;
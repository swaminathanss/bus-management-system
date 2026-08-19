 const express = require('express');
 const router = express.Router();
 const {
     createLocation,
     getAllLocations
 } = require('../controllers/locationController');
 const {
     protect,
     adminOnly
 } = require('../middleware/authMiddleware');
 router.post('/', protect, adminOnly, createLocation);
 router.get('/', getAllLocations);
 module.exports = router;
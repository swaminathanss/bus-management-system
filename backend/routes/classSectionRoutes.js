const express = require('express');
const router = express.Router();
const {
    createClassSection,
    getAllClassSections
} = require('../controllers/classSectionController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, createClassSection);
router.get('/', protect, getAllClassSections);
module.exports = router;
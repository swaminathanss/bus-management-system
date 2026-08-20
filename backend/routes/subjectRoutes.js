const express = require('express');
const router = express.Router();
const {
    createSubject,
    getAllSubjects
} = require('../controllers/subjectController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, createSubject);
router.get('/', protect, getAllSubjects);
module.exports = router;
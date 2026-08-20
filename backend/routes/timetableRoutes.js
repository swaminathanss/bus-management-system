const express = require('express');
const router = express.Router();
const {
    createTimetableEntry,
    getAllTimetableEntries,
    getTimetableForClass,
    getTimetableForTeacher
} = require('../controllers/timetableController');
const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');
router.post('/', protect, adminOnly, createTimetableEntry);
router.get('/', protect, adminOnly, getAllTimetableEntries);
router.get('/class/:classSectionId', protect, getTimetableForClass);
router.get('/teacher/:teacherId', protect, getTimetableForTeacher);
module.exports = router;
const Timetable = require('../models/Timetable');
exports.createTimetableEntry = async (req, res) => {
    try {
        const entry = await Timetable.create(req.body);
        res.status(201).json(entry);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getAllTimetableEntries = async (req, res) => {
    try {
        const entries = await Timetable.find().populate('classSectionId', 'name').populate('subjectId', 'name code').populate('teacherId', 'name').sort({
            dayOfWeek: 1,
            periodNumber: 1
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getMyTimetable = async (req, res) => {
    try {
        const entries = await Timetable.find({
            teacherId: req.user.id
        }).populate('subjectId', 'name code').populate('classSectionId', 'name').sort({
            dayOfWeek: 1,
            periodNumber: 1
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getTimetableForClass = async (req, res) => {
    try {
        const entries = await Timetable.find({
            classSectionId: req.params.classSectionId
        }).populate('subjectId', 'name code').populate('teacherId', 'name').sort({
            dayOfWeek: 1,
            periodNumber: 1
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getTimetableForTeacher = async (req, res) => {
    try {
        const entries = await Timetable.find({
            teacherId: req.params.teacherId
        }).populate('subjectId', 'name code').populate('classSectionId', 'name').sort({
            dayOfWeek: 1,
            periodNumber: 1
        });
        res.json(entries);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
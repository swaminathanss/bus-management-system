const AttendanceWindow = require('../models/AttendanceWindow');
const User = require('../models/User');
exports.openWindow = async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({
                message: 'Only teachers can open an attendance window'
            });
        }
        const {
            classSectionId,
            subjectId,
            periodNumber
        } = req.body;
        const today = new Date().toISOString().split('T')[0];
        const openedAt = new Date();
        const closesAt = new Date(openedAt.getTime() + 3 * 60 * 1000);
        const window = await AttendanceWindow.create({
            teacherId: req.user.id,
            classSectionId,
            subjectId,
            periodNumber,
            date: today,
            openedAt,
            closesAt
        });
        res.status(201).json(window);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getMyActiveWindow = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        if (!student.classSectionId) {
            return res.json(null);
        }
        const today = new Date().toISOString().split('T')[0];
        const activeWindow = await AttendanceWindow.findOne({
            classSectionId: student.classSectionId,
            date: today,
            closesAt: {
                $gt: new Date()
            }
        }).sort({
            openedAt: -1
        }).populate('subjectId', 'name');
        res.json(activeWindow);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
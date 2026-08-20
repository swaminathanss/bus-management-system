 const PeriodAttendance = require('../models/PeriodAttendance');
 const AttendanceWindow = require('../models/AttendanceWindow');
 const User = require('../models/User');
 exports.markPeriodAttendance = async (req, res) => {
     try {
         const {
             periodNumber
         } = req.body;
         const student = await User.findById(req.user.id);
         if (!student.classSectionId) {
             return res.status(400).json({
                 message: 'You are not assigned to a class section'
             });
         }
         const today = new Date().toISOString().split('T')[0];
         const activeWindow = await AttendanceWindow.findOne({
             classSectionId: student.classSectionId,
             periodNumber,
             date: today,
             closesAt: {
                 $gt: new Date()
             }
         });
         if (!activeWindow) {
             return res.status(400).json({
                 message: 'No active attendance window for this period'
             });
         }
         const existing = await PeriodAttendance.findOne({
             studentId: req.user.id,
             date: today,
             periodNumber
         });
         if (existing) {
             return res.status(400).json({
                 message: 'Already marked for this period'
             });
         }
         const record = await PeriodAttendance.create({
             studentId: req.user.id,
             classSectionId: student.classSectionId,
             date: today,
             periodNumber
         });
         res.status(201).json(record);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
 exports.getTodayPeriods = async (req, res) => {
     try {
         const today = new Date().toISOString().split('T')[0];
         const records = await PeriodAttendance.find({
             studentId: req.user.id,
             date: today
         }).sort({
             periodNumber: 1
         });
         res.json(records);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
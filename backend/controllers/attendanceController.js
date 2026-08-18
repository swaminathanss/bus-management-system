 const Attendance = require('../models/Attendance');
 exports.markAttendance = async (req, res) => {
     try {
         const {
             session
         } = req.body;
         if (session !== 'morning' && session !== 'evening') {
             return res.status(400).json({
                 message: 'Session must be morning or evening'
             });
         }
         const today = new Date().toISOString().split('T')[0];
         let record = await Attendance.findOne({
             studentId: req.user.id,
             date: today
         });
         if (!record) {
             record = new Attendance({
                 studentId: req.user.id,
                 date: today
             });
         }
         if (session === 'morning') record.morningMarkedAt = new Date();
         if (session === 'evening') record.eveningMarkedAt = new Date();
         if (record.morningMarkedAt && record.eveningMarkedAt) record.status = 'present';
         await record.save();
         res.json(record);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
 exports.getTodayAttendance = async (req, res) => {
     try {
         const today = new Date().toISOString().split('T')[0];
         const record = await Attendance.findOne({
             studentId: req.user.id,
             date: today
         });
         res.json(record || {
             status: 'not_marked'
         });
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
 const mongoose = require('mongoose');
 const attendanceWindowSchema = new mongoose.Schema({
     teacherId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
     },
     classSectionId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'ClassSection',
         required: true
     },
     subjectId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Subject',
         required: true
     },
     periodNumber: {
         type: Number,
         required: true
     },
     date: {
         type: String,
         required: true
     },
     openedAt: {
         type: Date,
         default: Date.now
     },
     closesAt: {
         type: Date,
         required: true
     }
 });
 module.exports = mongoose.model('AttendanceWindow', attendanceWindowSchema);
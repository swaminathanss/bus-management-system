 const mongoose = require('mongoose');
 const attendanceSchema = new mongoose.Schema({
     studentId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true },
        date: { type: String, required: true },
        morningMarkedAt: { type: Date },
        eveningMarkedAt: { type: Date },
        status: { type: String,
            enum: ['present', 'absent'],
            default: 'absent' } }); 
        module.exports = mongoose.model('Attendance', attendanceSchema);


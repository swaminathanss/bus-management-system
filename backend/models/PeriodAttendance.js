const mongoose = require('mongoose');
const periodAttendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classSectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassSection',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    periodNumber: {
        type: Number,
        required: true
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('PeriodAttendance', periodAttendanceSchema);
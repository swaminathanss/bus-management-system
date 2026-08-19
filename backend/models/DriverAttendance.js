const mongoose = require('mongoose');
const driverAttendanceSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('DriverAttendance', driverAttendanceSchema);
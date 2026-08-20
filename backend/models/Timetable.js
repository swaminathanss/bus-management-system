const mongoose = require('mongoose');
const timetableSchema = new mongoose.Schema({
    classSectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassSection',
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
    },
    periodNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Timetable', timetableSchema);
const mongoose = require('mongoose');
const allocationSchema = new mongoose.Schema({
     date: { type: String, required: true },
     studentId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true },
        busId: { type: mongoose.Schema.Types.ObjectId,
            ref: 'Bus', required: true },
            seatNumber: { type: Number,required: true } },
            { timestamps: true });
            module.exports = mongoose.model('Allocation', allocationSchema);
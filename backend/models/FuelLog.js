const mongoose = require('mongoose');
const fuelLogSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    litersFilled: {
        type: Number,
        required: true
    },
    kmCovered: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number
    },
    filledAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('FuelLog', fuelLogSchema);
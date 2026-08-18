const mongoose = require('mongoose');
const locationChangeRequestSchema = new mongoose.Schema({ 
    studentId: { type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true }, 
        date: { type: String, required: true }, 
        requestedLocation: { type: mongoose.Schema.Types.ObjectId, 
            ref: 'Location', required: true }, 
            requestedAt: { type: Date, default: Date.now }, 
            status: { type: String, enum: ['approved', 'pending', 'rejected'], 
                default: 'pending' } }); 
            module.exports = mongoose.model('LocationChangeRequest', locationChangeRequestSchema);
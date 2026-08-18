const mongoose = require('mongoose'); 
const emergencyTicketSchema = new mongoose.Schema({ 
    studentId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true }, 
        date: { type: String, required: true }, 
        description: { type: String, required: true }, 
        requestedLocation: { type: mongoose.Schema.Types.ObjectId, 
            ref: 'Location', required: true }, 
            status: { type: String, 
                enum: ['submitted', 'under_review', 'approved', 'rejected'], 
                default: 'submitted' }, 
                adminNote: { type: String } }, 
                { timestamps: true }); 
        module.exports = mongoose.model('EmergencyTicket', emergencyTicketSchema);
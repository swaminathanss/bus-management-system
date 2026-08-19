 const mongoose = require('mongoose');
 const busSchema = new mongoose.Schema({
     busNumber: {
         type: String,
         required: true,
         unique: true
     },
     capacity: {
         type: Number,
         required: true
     },
     routeId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Route'
     },
     driverName: {
         type: String,
         required: true
     },
     driverPhone: {
         type: String,
         required: true
     },
     parkingSlotNumber: {
         type: String,
         required: true
     },
     fuelLevel: {
         type: String,
         enum: ['full', 'half', 'low', 'empty'],
         default: 'full'
     },
     lastServiceDate: {
         type: Date
     },
     nextServiceDue: {
         type: Date
     },
     status: {
         type: String,
         enum: ['active', 'maintenance', 'inactive'],
         default: 'active'
     }
 });
 module.exports = mongoose.model('Bus', busSchema);
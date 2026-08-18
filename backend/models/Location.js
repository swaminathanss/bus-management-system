const mongoose = require('mongoose'); 
 const locationSchema = new mongoose.Schema({
     name: { type: String, 
     required: true }, 
     routeId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Route' } }); 
     module.exports = mongoose.model('Location', locationSchema);   
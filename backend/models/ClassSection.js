 const mongoose = require('mongoose');
 const classSectionSchema = new mongoose.Schema({
     name: {
         type: String,
         required: true,
         unique: true
     }
 }, {
     timestamps: true
 });
 module.exports = mongoose.model('ClassSection', classSectionSchema);
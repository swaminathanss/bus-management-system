const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    registerNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    defaultLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }
} , { timestamps: true });

     module.exports = mongoose.model('User', userSchema);
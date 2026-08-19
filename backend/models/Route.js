const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema
({ 
    name: { type: String,
    required: true 
    },
    area: { type: String },
    stops: [{ type: String }]
});
module.exports = mongoose.model('Route', routeSchema);
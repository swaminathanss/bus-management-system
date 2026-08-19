const Location = require('../models/Location');
exports.createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json(location);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find().populate('routeId', 'name stops');
        res.json(locations);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
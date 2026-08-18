const Bus = require('../models/Bus');
const Allocation = require('../models/Allocation');
exports.createBus = async (req, res) => {
    try {
        const bus = await Bus.create(req.body);
        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('routeId');
        res.json(buses);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id).populate('routeId');
        if (!bus) return res.status(404).json({
            message: 'Bus not found'
        });
        const today = new Date().toISOString().split('T')[0];
        const roster = await Allocation.find({
            busId: bus._id,
            date: today
        }).populate('studentId', 'name registerNumber mobileNumber');
        res.json({
            bus,
            roster
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(bus);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.deleteBus = async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Bus deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
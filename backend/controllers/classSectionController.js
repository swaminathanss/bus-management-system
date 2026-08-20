const ClassSection = require('../models/ClassSection');
exports.createClassSection = async (req, res) => {
    try {
        const classSection = await ClassSection.create(req.body);
        res.status(201).json(classSection);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getAllClassSections = async (req, res) => {
    try {
        const classSections = await ClassSection.find();
        res.json(classSections);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
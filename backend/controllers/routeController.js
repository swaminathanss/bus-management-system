const Route = require('../models/Route');
exports.createRoute = async (req, res) => {
    try {
        const { name, stops } = req.body;
        const normalizedStops = (stops || []).map((s) => s.trim().toLowerCase());

        const existingWithSameArea = await Route.find({ area: name });
        const isDuplicate = existingWithSameArea.some((r) => {
            const existingStops = (r.stops || []).map((s) => s.trim().toLowerCase());
            return existingStops.length === normalizedStops.length && existingStops.every((s, i) => s === normalizedStops[i]);
        });

        if (isDuplicate) {
            return res.status(400).json({
                message: 'A route with this area and the same stops already exists'
            });
        }

        const count = await Route.countDocuments();
        const letters = ['A', 'B', 'C', 'D'];
        const letter = letters[count % 4];
        const cycle = Math.floor(count / 4);
        const code = cycle === 0 ? letter : `${letter}${cycle}`;
        const fullName = `Route ${code} - ${name}`;

        const route = await Route.create({ name: fullName, area: name, stops });
        res.status(201).json(route);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
exports.updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.json(route);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
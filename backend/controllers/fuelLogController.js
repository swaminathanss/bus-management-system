const FuelLog = require('../models/FuelLog');
const Bus = require('../models/Bus');

exports.addFuelLog = async (req, res) => {
  try {
    const { litersFilled, kmCovered } = req.body;
    const busId = req.params.id;

    const lastLog = await FuelLog.findOne({ busId }).sort({ filledAt: -1 });

    const mileage = kmCovered && litersFilled ? Number((kmCovered / litersFilled).toFixed(2)) : null;

    const log = await FuelLog.create({ busId, litersFilled, kmCovered, mileage });

    await Bus.findByIdAndUpdate(busId, { fuelLevel: 'full' });

    let daysSinceLastFill = null;
    if (lastLog) {
      const diffMs = new Date(log.filledAt) - new Date(lastLog.filledAt);
      daysSinceLastFill = Math.round(diffMs / (1000 * 60 * 60 * 24));
    }

    res.status(201).json({ log, daysSinceLastFill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find({ busId: req.params.id }).sort({ filledAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFuelSummary = async (req, res) => {
  try {
    const logs = await FuelLog.find({ busId: req.params.id }).sort({ filledAt: 1 });

    if (logs.length === 0) {
      return res.json({ avgIntervalDays: null, daysSinceLastFill: null, overdue: false });
    }

    let avgIntervalDays = null;
    if (logs.length >= 2) {
      const intervals = [];
      for (let i = 1; i < logs.length; i++) {
        const diffMs = new Date(logs[i].filledAt) - new Date(logs[i - 1].filledAt);
        intervals.push(diffMs / (1000 * 60 * 60 * 24));
      }
      avgIntervalDays = Number((intervals.reduce((a, b) => a + b, 0) / intervals.length).toFixed(1));
    }

    const lastFill = logs[logs.length - 1].filledAt;
    const daysSinceLastFill = Math.round((new Date() - new Date(lastFill)) / (1000 * 60 * 60 * 24));

    const overdue = avgIntervalDays !== null && daysSinceLastFill > avgIntervalDays * 1.25;

    res.json({ avgIntervalDays, daysSinceLastFill, overdue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
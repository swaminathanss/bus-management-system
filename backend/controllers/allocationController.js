const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Location = require('../models/Location');
const LocationChangeRequest = require('../models/LocationChangeRequest');
const Bus = require('../models/Bus');
const Allocation = require('../models/Allocation');

const runAllocation = async () => {
  const today = new Date().toISOString().split('T')[0];

  const presentRecords = await Attendance.find({ date: today, status: 'present' });
  const studentIds = presentRecords.map((r) => r.studentId);

  const approvedChanges = await LocationChangeRequest.find({
    date: today,
    status: 'approved',
    studentId: { $in: studentIds }
  });
  const changeMap = {};
  approvedChanges.forEach((c) => {
    changeMap[c.studentId.toString()] = c.requestedLocation;
  });

  const users = await User.find({ _id: { $in: studentIds } });
  const userMap = {};
  users.forEach((u) => {
    userMap[u._id.toString()] = u;
  });

  const groups = {};
  presentRecords.forEach((record) => {
    const sid = record.studentId.toString();
    const user = userMap[sid];
    if (!user) return;
    const locationId = (changeMap[sid] || user.defaultLocation)?.toString();
    if (!locationId) return;
    if (!groups[locationId]) groups[locationId] = [];
    groups[locationId].push({
      studentId: record.studentId,
      timestamp: record.eveningMarkedAt || record.morningMarkedAt
    });
  });

  await Allocation.deleteMany({ date: today });

  const allocationsToInsert = [];

  for (const locationId of Object.keys(groups)) {
    const location = await Location.findById(locationId);
    if (!location || !location.routeId) continue;

    const buses = await Bus.find({ routeId: location.routeId }).sort({ busNumber: 1 });
    if (buses.length === 0) continue;

    const students = groups[locationId].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let busIndex = 0;
    let seatNumber = 1;

    for (const student of students) {
      while (busIndex < buses.length && seatNumber > buses[busIndex].capacity) {
        busIndex++;
        seatNumber = 1;
      }
      if (busIndex >= buses.length) break;
      allocationsToInsert.push({
        date: today,
        studentId: student.studentId,
        busId: buses[busIndex]._id,
        seatNumber
      });
      seatNumber++;
    }
  }

  if (allocationsToInsert.length > 0) {
    await Allocation.insertMany(allocationsToInsert);
  }

  return { date: today, totalAllocated: allocationsToInsert.length };
};

exports.generateAllocation = async (req, res) => {
  try {
    const result = await runAllocation();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodayAllocation = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const allocations = await Allocation.find({ date: today })
      .populate('studentId', 'name registerNumber')
      .populate('busId', 'busNumber parkingSlotNumber driverName driverPhone');
    res.json(allocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBus = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const allocation = await Allocation.findOne({ date: today, studentId: req.user.id }).populate('busId');
    if (!allocation) return res.json({ message: 'Not allocated yet' });
    res.json(allocation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.runAllocation = runAllocation;
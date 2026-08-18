const LocationChangeRequest = require('../models/LocationChangeRequest');
const EmergencyTicket = require('../models/EmergencyTicket');

const isPastCutoff = () => {
  const cutoff = process.env.ATTENDANCE_CUTOFF_TIME || '15:00';
  const [hour, minute] = cutoff.split(':').map(Number);
  const now = new Date();
  const cutoffTime = new Date();
  cutoffTime.setHours(hour, minute, 0, 0);
  return now > cutoffTime;
};

exports.requestLocationChange = async (req, res) => {
  try {
    if (isPastCutoff()) {
      return res.status(400).json({ message: 'Cutoff time passed. Please raise an emergency ticket instead.' });
    }
    const { requestedLocation } = req.body;
    const today = new Date().toISOString().split('T')[0];
    let request = await LocationChangeRequest.findOne({ studentId: req.user.id, date: today });
    if (!request) {
      request = new LocationChangeRequest({ studentId: req.user.id, date: today, requestedLocation, status: 'approved' });
    } else {
      request.requestedLocation = requestedLocation;
      request.status = 'approved';
      request.requestedAt = new Date();
    }
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.raiseEmergencyTicket = async (req, res) => {
  try {
    if (!isPastCutoff()) {
      return res.status(400).json({ message: 'Emergency tickets are only for after cutoff time. Use normal location change instead.' });
    }
    const { description, requestedLocation } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const ticket = await EmergencyTicket.create({
      studentId: req.user.id,
      date: today,
      description,
      requestedLocation,
      status: 'submitted'
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await EmergencyTicket.find()
      .populate('studentId', 'name registerNumber mobileNumber')
      .populate('requestedLocation', 'name')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reviewTicket = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const ticket = await EmergencyTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.status = status;
    ticket.adminNote = adminNote || ticket.adminNote;
    await ticket.save();

    if (status === 'approved') {
      let request = await LocationChangeRequest.findOne({ studentId: ticket.studentId, date: ticket.date });
      if (!request) {
        request = new LocationChangeRequest({
          studentId: ticket.studentId,
          date: ticket.date,
          requestedLocation: ticket.requestedLocation,
          status: 'approved'
        });
      } else {
        request.requestedLocation = ticket.requestedLocation;
        request.status = 'approved';
      }
      await request.save();
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 const Driver = require('../models/Driver');
 const DriverAttendance = require('../models/DriverAttendance');
 exports.createDriver = async (req, res) => {
     try {
         const driver = await Driver.create(req.body);
         res.status(201).json(driver);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
 exports.getAllDrivers = async (req, res) => {
     try {
         const drivers = await Driver.find().populate('assignedBus', 'busNumber');
         res.json(drivers);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
 exports.markDriverAttendance = async (req, res) => {
     try {
         const {
             driverId,
             status
         } = req.body;
         const today = new Date().toISOString().split('T')[0];
         let record = await DriverAttendance.findOne({
             driverId,
             date: today
         });
         if (!record) {
             record = new DriverAttendance({
                 driverId,
                 date: today,
                 status
             });
         } else {
             record.status = status;
             record.markedAt = new Date();
         }
         await record.save();
         res.json(record);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };
 exports.getTodayDriverAttendance = async (req, res) => {
     try {
         const today = new Date().toISOString().split('T')[0];
         const drivers = await Driver.find().populate('assignedBus', 'busNumber');
         const records = await DriverAttendance.find({
             date: today
         });
         const recordMap = {};
         records.forEach((r) => {
             recordMap[r.driverId.toString()] = r.status;
         });
         const result = drivers.map((d) => ({
             _id: d._id,
             name: d.name,
             phone: d.phone,
             licenseNumber: d.licenseNumber,
             assignedBus: d.assignedBus,
             status: recordMap[d._id.toString()] || 'unmarked'
         }));
         res.json(result);
     } catch (err) {
         res.status(500).json({
             message: err.message
         });
     }
 };

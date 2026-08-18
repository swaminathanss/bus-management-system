const cron = require('node-cron');
const {
    runAllocation
} = require('../controllers/allocationController');
const scheduleAllocationJob = () => {
    const cutoff = process.env.ATTENDANCE_CUTOFF_TIME || '15:00';
    const [hour, minute] = cutoff.split(':');
    const cronExpression = `${minute} ${hour} * * *`;
    cron.schedule(cronExpression, async () => {
        console.log('Running scheduled bus allocation...');
        try {
            const result = await runAllocation();
            console.log('Allocation complete:', result);
        } catch (err) {
            console.error('Allocation job failed:', err.message);
        }
    });
    console.log(`Allocation cron scheduled at ${cutoff} daily`);
};
module.exports = scheduleAllocationJob;
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const jobRoutes = require('./src/api/jobs.routes');
const runJobFetcher = require('./src/workers/jobFetcher');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', jobRoutes);

app.get('/', (req, res) => {
    res.send('Govt Jobs AI Engine is running');
});

// Schedule Cron Job: Runs every 6 hours
// "0 */6 * * *"
cron.schedule('0 */6 * * *', () => {
    logger.info('Cron job triggered: Starting scrape cycle');
    runJobFetcher();
});

// Start Server
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info('Cron job scheduled for every 6 hours');
});

// Run scraper once on startup (optional, for demo)
// runJobFetcher(); 

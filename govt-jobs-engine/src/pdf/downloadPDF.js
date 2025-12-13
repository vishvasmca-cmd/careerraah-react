const axios = require('axios');
const logger = require('../utils/logger');

async function downloadPDF(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        logger.info(`Downloaded PDF from ${url}, size: ${response.data.length} bytes`);
        return response.data;
    } catch (error) {
        logger.error(`Failed to download PDF from ${url}: ${error.message}`);
        throw error;
    }
}

module.exports = downloadPDF;

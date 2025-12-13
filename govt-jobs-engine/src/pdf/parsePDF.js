const pdf = require('pdf-parse');
const logger = require('../utils/logger');

async function parsePDF(dataBuffer) {
    try {
        const data = await pdf(dataBuffer);
        logger.info(`Parsed PDF, text length: ${data.text.length} chars`);
        return data.text;
    } catch (error) {
        logger.error('Error parsing PDF:', error);
        throw error;
    }
}

module.exports = parsePDF;

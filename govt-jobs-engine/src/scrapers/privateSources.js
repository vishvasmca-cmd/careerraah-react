const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');
const https = require('https');

async function scrapePrivateAggregators() {
    logger.info('Starting Private Aggregator Scraper');
    const results = [];
    const agent = new https.Agent({ rejectUnauthorized: false });
    const config = { headers: { 'User-Agent': 'Mozilla/5.0' }, httpsAgent: agent };

    // --- 1. FreeJobAlert ---
    try {
        logger.info('Scraping FreeJobAlert...');
        const { data } = await axios.get('https://www.freejobalert.com/latest-notifications/', config);
        const $ = cheerio.load(data);

        // Selector based on analysis: Links inside the proprietary table structure or lists
        // FreeJobAlert often uses specific classes like .lattest-notifications-list
        // or just simple paragraphs with links in recent updates.
        // We look for 'Get Details' links or direct post links.

        $('a').each((i, el) => {
            const text = $(el).text().trim();
            const href = $(el).attr('href');

            // Logic: Links that look like post pages
            if (href && href.includes('freejobalert.com') && (text.includes('Get Details') || text.length > 10)) {
                // Clean title implies getting the text of the row, but often the link text is just "Get Details"
                // So we might need the previous sibling or parent text if the link is generic.
                // For now, let's grab the text. If it is "Get Details", we try to find the "Post Name" usually in the same row.

                let title = text;
                if (title === 'Get Details') {
                    // Try to find a meaningful title in the parent row/container
                    // heuristic: the <tr> contains the title in another <td>?
                    // Or just skip "Get Details" text links and look for the main link?
                    // Actually FreeJobAlert has "Post Name" as a link often.
                    return;
                }

                if (title.length > 15 && !results.some(r => r.url === href)) {
                    results.push({
                        title: title,
                        url: href,
                        source: 'FreeJobAlert',
                        department: 'Various'
                    });
                }
            }
        });
        logger.info(`FreeJobAlert: Found ${results.length} potentials`);
    } catch (error) {
        logger.error('Error scraping FreeJobAlert:', error.message);
    }

    // --- 2. SarkariNaukri.in (Placeholder / mocked for now as next step) ---
    // We can add a similar block here later.

    return results;
}

module.exports = scrapePrivateAggregators;

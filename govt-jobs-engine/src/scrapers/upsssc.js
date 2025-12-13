const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeUPSSSC() {
    logger.info('Starting UPSSSC Scraper');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('http://upsssc.gov.in', { waitUntil: 'domcontentloaded', timeout: 60000 });

        const notices = await page.evaluate(() => {
            const items = [];
            // Look for Notice Board section
            const links = document.querySelectorAll('a');

            links.forEach(link => {
                const text = link.innerText.trim();
                const href = link.href;

                // Filtering logic
                if (href.toLowerCase().endsWith('.pdf') &&
                    (text.toLowerCase().includes('advertisement') || text.toLowerCase().includes('vigyapan'))) {
                    items.push({
                        title: text,
                        url: href,
                        source: 'UPSSSC',
                        department: 'Uttar Pradesh Subordinate Services Selection Commission'
                    });
                }
            });
            return items.slice(0, 5);
        });

        logger.info(`Found ${notices.length} notices from UPSSSC`);
        return notices;

    } catch (error) {
        logger.error('Error scraping UPSSSC:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = scrapeUPSSSC;

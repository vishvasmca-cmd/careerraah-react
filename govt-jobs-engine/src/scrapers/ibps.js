const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeIBPS() {
    logger.info('Starting IBPS Scraper');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://ibps.in', { waitUntil: 'networkidle2', timeout: 60000 });

        const notices = await page.evaluate(() => {
            const items = [];
            const links = document.querySelectorAll('a');

            links.forEach(link => {
                const text = link.innerText.trim();
                const href = link.href;

                if (text.toLowerCase().includes('crp') || text.toLowerCase().includes('clerk') || text.toLowerCase().includes('po')) {
                    items.push({
                        title: text,
                        url: href, // IBPS often links to a sub-page, not directly PDF, but we'll capture the entry point
                        source: 'IBPS',
                        department: 'Institute of Banking Personnel Selection'
                    });
                }
            });
            return items.slice(0, 5);
        });

        // Attempt to drill down or just return the landing pages for now. 
        // For a robust engine, we would visit each 'url' to find the PDF.
        // Keeping it simple for the MVP core structure.

        logger.info(`Found ${notices.length} notices from IBPS`);
        return notices;

    } catch (error) {
        logger.error('Error scraping IBPS:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = scrapeIBPS;

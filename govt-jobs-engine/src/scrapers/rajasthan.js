const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeRajasthan() {
    logger.info('Starting Rajasthan (RPSC) Scraper');
    // RPSC: https://rpsc.rajasthan.gov.in/

    const results = [];
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Go to News/Notification section directly if possible or home
        await page.goto('https://rpsc.rajasthan.gov.in/news', { waitUntil: 'domcontentloaded', timeout: 30000 });

        const jobs = await page.evaluate(() => {
            const items = [];
            // RPSC usually has a table with "News Title" and "Link"
            // Let's assume a table structure.
            const rows = Array.from(document.querySelectorAll('table tbody tr'));

            rows.forEach(row => {
                // Check if date is recent? 
                // extract text and link
                const anchor = row.querySelector('a');
                if (anchor) {
                    const title = row.innerText.trim();
                    if (title.includes('Recruitment') || title.includes('Advt')) {
                        items.push({
                            title: title.split('\n')[0].substring(0, 150),
                            url: anchor.href,
                            source: 'RPSC',
                            department: 'Rajasthan Public Service Commission'
                        });
                    }
                }
            });
            return items.slice(0, 5);
        });

        results.push(...jobs);
        logger.info(`Found ${jobs.length} RPSC jobs`);

    } catch (error) {
        logger.error('Error scraping RPSC: ' + error.message);
    } finally {
        if (browser) await browser.close();
    }

    return results;
}

module.exports = scrapeRajasthan;

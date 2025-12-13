const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeSSC() {
    logger.info('Starting SSC Scraper');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://ssc.nic.in', { waitUntil: 'networkidle2', timeout: 60000 });

        // SSC usually lists latest news. We'll look for keywords like "Notice", "Examination"
        // This selector is an approximation based on common SSC structure (e.g., .latest-news-updates)

        const notices = await page.evaluate(() => {
            const items = [];
            // Select anchors in the notices section. Adjust selector based on actual site structure at runtime if needed.
            const links = document.querySelectorAll('a');

            links.forEach(link => {
                const text = link.innerText.trim();
                const href = link.href;

                if (href.toLowerCase().endsWith('.pdf') &&
                    (text.toLowerCase().includes('notice') || text.toLowerCase().includes('examination'))) {
                    items.push({
                        title: text,
                        url: href,
                        source: 'SSC',
                        department: 'Staff Selection Commission'
                    });
                }
            });
            return items.slice(0, 5); // Return top 5 relevant PDFs
        });

        logger.info(`Found ${notices.length} notices from SSC`);
        return notices;

    } catch (error) {
        logger.error('Error scraping SSC:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

module.exports = scrapeSSC;

const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeMP() {
    logger.info('Starting MP ESB Scraper');
    // URL: https://esb.mp.gov.in/e_default.html -> Loads home_n.html in iframe
    // We can target home_n.html directly to avoid iframe complexity if allowed, 
    // but better to visit the main page and wait for frame or go to frame URL.
    // Direct frame URL: https://esb.mp.gov.in/home_n.html

    const results = [];
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });

        const page = await browser.newPage();

        // Visiting the content frame directly to be robust
        await page.goto('https://esb.mp.gov.in/home_n.html', { waitUntil: 'domcontentloaded', timeout: 30000 });

        const mpJobs = await page.evaluate(() => {
            const items = [];
            // The page seems to have links in a marquee or list.
            // Based on read_url content:
            // Links text: "Police Constable Recruitment Test - 2025", etc.
            const links = Array.from(document.querySelectorAll('a'));

            links.forEach(a => {
                const text = a.innerText.trim();
                const href = a.href;

                // Filter keywords
                if (href && (text.includes('Recruitment Test') || text.includes('Entrance Test') || text.includes('Selection Test'))) {
                    // Avoid "Test Admit Card" or "Result" if we only want new notifications?
                    // The user's query just said "get the mp job". 
                    // Usually "Recruitment Test - 2025" implies the notification or landing page for it.
                    // If it starts with "Result -" or "Test Admit Card -", we might skip unless we want updates.
                    // Let's keep "Recruitment Test" but skip "Result"

                    if (!text.startsWith('Result') && !text.startsWith('Test Admit Card')) {
                        items.push({
                            title: text,
                            url: href,
                            source: 'MP ESB',
                            department: 'Madhya Pradesh Employees Selection Board'
                        });
                    }
                }
            });
            return items.slice(0, 10);
        });

        results.push(...mpJobs);
        logger.info(`Found ${mpJobs.length} MP ESB jobs`);

    } catch (error) {
        logger.error('Error scraping MP ESB', error);
    } finally {
        if (browser) await browser.close();
    }

    return results;
}

module.exports = scrapeMP;

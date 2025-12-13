const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeUP() {
    logger.info('Starting UP (UPPSC) Scraper');
    // UPPSC: https://uppsc.up.nic.in/
    // Metioning UPSSSC as well, though we have a separate one.
    // This module can aggregate both state portals.

    const results = [];
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // --- Scrape UPPSC ---
        try {
            await page.goto('https://uppsc.up.nic.in/', { waitUntil: 'domcontentloaded', timeout: 30000 });

            // UPPSC has "All Notifications / Advertisements" section
            // Finding the link to 'All Notifications' page is better, but let's try home/marquee/sidebar
            // Common ID: 'ContentPlaceHolder1_GridNotifications' or similar on internal pages.
            // On home: 'View All' under Notifications.

            // Strategy: Look for "Recruitment Dashboard" or "Notifications" links
            const jobs = await page.evaluate(() => {
                const items = [];
                // Basic anchor scan for 'Examination' 'Recruitment'
                const links = Array.from(document.querySelectorAll('a'));
                links.forEach(a => {
                    const text = a.innerText.trim();
                    if (text.includes('Recruitment') || text.includes('Exam') || text.includes('Notificiation')) {
                        // Filter out generic links like "Recruitment Dashboard" if duplication risks
                        if (a.href.includes('.pdf') || a.href.includes('View')) {
                            items.push({
                                title: text,
                                url: a.href,
                                source: 'UPPSC',
                                department: 'UP Public Service Commission'
                            });
                        }
                    }
                });
                return items.slice(0, 5);
            });
            results.push(...jobs);
            logger.info(`Found ${jobs.length} UPPSC jobs`);

        } catch (e) {
            logger.error('Error scraping UPPSC', e);
        }

    } catch (error) {
        logger.error('Error in UP Scraper', error);
    } finally {
        if (browser) await browser.close();
    }

    return results;
}

module.exports = scrapeUP;

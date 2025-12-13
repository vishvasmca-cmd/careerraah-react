const puppeteer = require('puppeteer');
const logger = require('../utils/logger');

async function scrapeBihar() {
    logger.info('Starting Bihar (BPSC/BSSC) Scraper');
    // BPSC: https://www.bpsc.bih.nic.in/
    // BSSC: https://bssc.bihar.gov.in/

    const results = [];
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] // Optimization for server env
        });

        const page = await browser.newPage();

        // --- Scrape BPSC ---
        try {
            await page.goto('https://www.bpsc.bih.nic.in/', { waitUntil: 'domcontentloaded', timeout: 30000 });

            // BPSC usually lists notifications in a marquee or a main table.
            // We'll look for links containing 'Important Notice' or 'Advertisement'.
            const bpscJobs = await page.evaluate(() => {
                const items = [];
                // This is a heuristic selector. BPSC structure often changes.
                // Targeting the main content area or marquee.
                const links = Array.from(document.querySelectorAll('a'));

                links.forEach(a => {
                    const text = a.innerText.trim();
                    const href = a.href;
                    if (href && (text.includes('Important Notice') || text.includes('Advertisement'))) {
                        items.push({
                            title: text,
                            url: href,
                            source: 'BPSC',
                            department: 'Bihar Public Service Commission'
                        });
                    }
                });
                return items.slice(0, 5); // Take top 5 recent
            });

            results.push(...bpscJobs);
            logger.info(`Found ${bpscJobs.length} BPSC jobs`);

        } catch (e) {
            logger.error('Error scraping BPSC: ' + e.message);
        }

        // --- Scrape BSSC ---
        try {
            await page.goto('https://bssc.bihar.gov.in/', { waitUntil: 'domcontentloaded', timeout: 30000 });

            const bsscJobs = await page.evaluate(() => {
                const items = [];
                // Look for Notice Board or similar.
                // Common pattern: table rows with links
                const rows = Array.from(document.querySelectorAll('table tr')); // Broad selector

                rows.forEach(row => {
                    // Heuristic: row has text "Advt" and a link "View" or "Download"
                    if (row.innerText.includes('Advt')) {
                        const anchor = row.querySelector('a');
                        if (anchor) {
                            items.push({
                                title: row.innerText.split('\n')[0].substring(0, 100), // Approximate title
                                url: anchor.href,
                                source: 'BSSC',
                                department: 'Bihar Staff Selection Commission'
                            });
                        }
                    }
                });
                return items.slice(0, 5);
            });
            results.push(...bsscJobs);
            logger.info(`Found ${bsscJobs.length} BSSC jobs`);

        } catch (e) {
            logger.error('Error scraping BSSC: ' + e.message);
        }

    } catch (error) {
        logger.error('Critical error in Bihar Scraper', error);
    } finally {
        if (browser) await browser.close();
    }

    return results;
}

module.exports = scrapeBihar;

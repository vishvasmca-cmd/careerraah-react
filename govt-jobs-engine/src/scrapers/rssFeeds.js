const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

const FEEDS = [
    {
        name: 'Hindustan Times',
        url: 'https://www.hindustantimes.com/feeds/rss/education/employment-news/rssfeed.xml',
        sourceName: 'Hindustan Times (Employment)'
    },
    {
        name: 'Economic Times',
        url: 'https://government.economictimes.indiatimes.com/rss/topstories',
        sourceName: 'Economic Times (Govt)'
    },
    {
        name: 'CareerIndia',
        url: 'https://www.careerindia.com/rss/feeds/education-exams-fb.xml',
        sourceName: 'CareerIndia'
    },
    {
        name: 'Times of India (Education)',
        url: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
        sourceName: 'Times of India'
    },
    {
        name: 'News18 Careers',
        url: 'https://www.news18.com/commonfeeds/v1/en/rss/career.xml',
        sourceName: 'News18'
    },
    {
        name: 'LiveMint Education',
        url: 'https://www.livemint.com/rss/education',
        sourceName: 'LiveMint'
    },
    // --- Hindi Powerhouse Feeds ---
    {
        name: 'Amar Ujala (UP Jobs)',
        url: 'https://www.amarujala.com/rss/news/jobs.xml',
        sourceName: 'Amar Ujala'
    },
    {
        name: 'CareerIndia Hindi',
        url: 'https://hindi.careerindia.com/rss/feeds/hindi-jobs-fb.xml',
        sourceName: 'CareerIndia Hindi'
    },
    {
        name: 'Live Hindustan (Bihar)',
        url: 'https://feed-api.livehindustan.com/rss/career/rssfeed.xml',
        sourceName: 'Live Hindustan'
    },
    {
        name: 'News18 Hindi',
        url: 'https://hindi.news18.com/commonfeeds/v1/hin/rss/career.xml',
        sourceName: 'News18 Hindi'
    },
    // --- National English Feeds ---
    {
        name: 'Indian Express Jobs',
        url: 'https://indianexpress.com/section/jobs/feed/',
        sourceName: 'Indian Express'
    },
    {
        name: 'Zee News National',
        url: 'https://zeenews.india.com/rss/india-national-news.xml',
        sourceName: 'Zee News'
    }
];

async function scrapeRSSFeeds() {
    logger.info('--- Starting RSS Feed Scraper ---');
    const notices = [];

    for (const feed of FEEDS) {
        try {
            logger.info(`Fetching RSS: ${feed.name}`);
            const response = await axios.get(feed.url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                timeout: 10000
            });

            const $ = cheerio.load(response.data, { xmlMode: true });

            $('item').each((i, el) => {
                const title = $(el).find('title').text().trim();
                const link = $(el).find('link').text().trim();
                const pubDate = $(el).find('pubDate').text().trim();
                const description = $(el).find('description').text().trim();

                // Basic validation: Must be a job/recruitment related item
                if (!link || !title) return;

                // Expanded keywords to include Hindi terms for new Hindi feeds
                const keywords = [
                    'recruit', 'job', 'vacancy', 'post', 'apply', 'notification', 'admit card', 'result', 'hiring', 'officer',
                    'भर्ती', 'नौकरी', 'पद', 'आवेदन', 'अधिसूचना', 'परिणाम' // Hindi keywords
                ];
                const isRelevant = keywords.some(k => textToCheck.includes(k));

                if (isRelevant) {
                    notices.push({
                        title: title,
                        url: link,
                        department: 'Government', // Default, AI will refine
                        source: feed.sourceName,
                        postedDate: pubDate ? new Date(pubDate) : new Date(),
                        isPDF: link.toLowerCase().endsWith('.pdf')
                    });
                }
            });

        } catch (error) {
            logger.error(`Error fetching RSS ${feed.name}: ${error.message}`);
        }
    }

    logger.info(`RSS Scraper found ${notices.length} relevant notices.`);
    return notices;
}

module.exports = scrapeRSSFeeds;

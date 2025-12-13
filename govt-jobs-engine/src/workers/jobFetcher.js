const scrapeSSC = require('../scrapers/ssc');
const scrapeUPSSSC = require('../scrapers/upsssc');
const scrapeIBPS = require('../scrapers/ibps');
const scrapePrivateAggregators = require('../scrapers/privateSources');
const scrapeBihar = require('../scrapers/bihar');
const scrapeRajasthan = require('../scrapers/rajasthan');
const scrapeUP = require('../scrapers/up');
const scrapeMP = require('../scrapers/mp');
const downloadPDF = require('../pdf/downloadPDF');
const parsePDF = require('../pdf/parsePDF');
const extractJobDetails = require('../ai/extractJobDetails');
const generateHindiSummary = require('../ai/hindiSummary');
const generateSEOArticle = require('../ai/seoArticle');
const saveJob = require('../db/saveJob');
const supabase = require('../db/supabase');
const logger = require('../utils/logger');
const parseSarkariResult = require('../scrapers/sarkariParser');
const rawLayer = require('../db/rawLayer');

async function runJobFetcher() {
    logger.info('--- Starting Job Fetcher Worker ---');

    // 1. Aggregate all findings
    const allNotices = [];
    let stopAIGeneration = false;

    const scrapeRSSFeeds = require('../scrapers/rssFeeds');

    // existing scrapers
    const scrapers = [
        scrapeRSSFeeds, // Priority content
        scrapeSSC,
        scrapeUPSSSC,
        scrapeIBPS,
        scrapePrivateAggregators,
        scrapeBihar,
        scrapeRajasthan,
        scrapeUP,
        scrapeMP
    ];

    for (const scraper of scrapers) {
        try {
            const results = await scraper();
            allNotices.push(...results);
        } catch (err) {
            logger.error('Scraper failed', err);
        }
    }

    logger.info(`Total notices found: ${allNotices.length}`);

    // 2. Process each notice
    for (const notice of allNotices) {

        try {
            // STEP 1: SAVE RAW DATA (Archive)
            const rawRecord = await rawLayer.saveRaw({
                ...notice,
                htmlContent: '', // Will populate if non-pdf
                rawText: '' // Will populate after processing
            });
            // We continue processing even if raw save fails (optional choice), 
            // but let's assume we want to analyze immediately too.

            // optimization: check if exists in DB to avoid AI costs
            const { data: existing } = await supabase
                .from('jobs')
                .select('id')
                .eq('url', notice.url)
                //.or(`title.eq.${notice.title}`) // Basic dedupe on title too? risky if generic title
                .single();

            if (existing && existing.seo_content) {
                logger.info(`Skipping existing job (Master): ${notice.url}`);
                if (rawRecord) await rawLayer.markProcessed(rawRecord.id, existing.id);
                continue;
            }
            if (existing && !existing.seo_content) {
                logger.info(`Refreshing existing job to generate SEO content: ${notice.url}`);
                // Proceed to processing...
            }

            logger.info(`Processing: ${notice.title}`);

            let rawText = '';
            let htmlContent = ''; // Capture full HTML for rule-based parsers

            // If it's a PDF, download and parse
            if (notice.url.toLowerCase().endsWith('.pdf')) {
                const pdfBuffer = await downloadPDF(notice.url);
                rawText = await parsePDF(pdfBuffer);
            } else {
                // Fallback for non-PDFs: Fetch HTML and extract text
                logger.info(`Fetching HTML content for: ${notice.url}`);
                try {
                    const cheerio = require('cheerio');
                    const axios = require('axios');
                    const https = require('https');

                    const agent = new https.Agent({
                        rejectUnauthorized: false
                    });

                    const { data: html } = await axios.get(notice.url, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        httpsAgent: agent
                    });

                    htmlContent = html; // Store for parser

                    const $ = cheerio.load(html);
                    // Remove scripts, styles
                    $('script').remove();
                    $('style').remove();
                    rawText = $('body').text().replace(/\s+/g, ' ').trim();
                    logger.info(`Extracted ${rawText.length} chars from HTML`);
                } catch (e) {
                    logger.error(`Failed to fetch HTML ${notice.url}: ${e.message}`);
                    continue;
                }
            }

            if (!rawText || rawText.length < 50) {
                logger.warn('Text content too empty, skipping AI extraction.');
                continue;
            }

            // 3. AI Extraction
            let structuredData = null;

            if (!stopAIGeneration) {
                try {
                    structuredData = await extractJobDetails(rawText);
                } catch (e) {
                    if (e.status === 429 || e.message?.includes('429')) {
                        logger.warn('AI 429 Rate Limit. Stopping AI for this run.');
                        stopAIGeneration = true;
                        // Fallback?
                    } else {
                        logger.error(`AI Extraction failed: ${e.message}`);
                    }
                }
            }

            if (!structuredData) {
                logger.warn('Extraction returned null');
                continue;
            }

            // 4. Freshness Check (New Filter)
            const today = new Date();
            const year = today.getFullYear();

            // Check 1: Expiry Date
            if (structuredData.applicationEndDate) {
                const endDate = new Date(structuredData.applicationEndDate);
                if (!isNaN(endDate) && endDate < today) {
                    logger.warn(`Skipping Expired Job: ${notice.title} (Ended: ${structuredData.applicationEndDate})`);
                    continue;
                }
            }

            // Check 2: Stale Title Year (e.g., if title says "2023" or "2024" when it's Dec 2025)
            // We assume 2024 is now "old" since we are in late 2025. 
            // Valid years: 2025, 2026+
            const titleLower = notice.title.toLowerCase();
            if (titleLower.includes('2023') || titleLower.includes('2024')) {
                logger.warn(`Skipping Stale Year Job: ${notice.title}`);
                continue;
            }

            // 5. Hindi Summary
            let summary = null;
            if (!stopAIGeneration) {
                try {
                    summary = await generateHindiSummary(structuredData);
                } catch (e) {
                    if (e.status === 429 || e.message?.includes('429')) stopAIGeneration = true;
                    else logger.error(`Hindi Summary failed: ${e.message}`);
                }
            }

            // 6. SEO Article Generation (CareerRaah Exclusive)
            let seoContent = null;
            if (!stopAIGeneration) {
                try {
                    seoContent = await generateSEOArticle({
                        ...structuredData,
                        rawText: rawText.substring(0, 5000) // Context
                    });
                } catch (e) {
                    if (e.status === 429 || e.message?.includes('429')) stopAIGeneration = true;
                    else logger.error(`SEO Article Generation failed: ${e.message}`);
                }
            }


            // 7. Generate Fingerprint & Smart Merge
            let fingerprint = null;
            if (structuredData.advertisementNumber && structuredData.advertisementNumber.length > 3) {
                const cleanAdvt = structuredData.advertisementNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const cleanDept = (structuredData.department || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 5);
                fingerprint = `advt-${cleanDept}-${cleanAdvt}`;
            } else {
                // Fallback: title-based
                const cleanTitle = (structuredData.jobTitle || notice.title).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 40);
                fingerprint = `title-${cleanTitle}`;
            }

            // Check if fingerprint exists
            const { data: duplicate } = await supabase
                .from('jobs')
                .select('id, source_links')
                .eq('fingerprint', fingerprint)
                .single();

            if (duplicate) {
                logger.info(`Smart Merge: Merging ${notice.url} with existing ID ${duplicate.id}`);

                // Update source_links
                let currentLinks = duplicate.source_links || [];
                if (!Array.isArray(currentLinks)) currentLinks = []; // safety
                if (!currentLinks.includes(notice.url)) {
                    currentLinks.push(notice.url);

                    // Update the row
                    await supabase.from('jobs').update({
                        source_links: currentLinks,
                        // We could also update 'pdf_url' if the new one is better?
                        // For now just linking sources.
                    }).eq('id', duplicate.id);
                }

                if (rawRecord) await rawLayer.markProcessed(rawRecord.id, duplicate.id);
                continue; // Skip Insert
            }

            const jobRecord = {
                title: structuredData.jobTitle || notice.title,
                department: structuredData.department || notice.department,
                source: notice.source,
                url: notice.url,
                pdf_url: notice.url,
                raw_text: rawText,
                structured: structuredData,
                hindi_summary: summary,
                fingerprint: fingerprint,
                source_links: [notice.url],
                summary: structuredData.summary,
                seo_content: seoContent
            };

            const saved = await saveJob(jobRecord);
            if (saved && rawRecord) {
                await rawLayer.markProcessed(rawRecord.id, saved[0]?.id);
            }

        } catch (err) {
            logger.error(`Failed to process notice ${notice.url}: ${err.message}`);
        }
        // Rate limiting delay (1s if AI stopped, else 30s)
        const delay = stopAIGeneration ? 1000 : 30000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    logger.info('--- Job Fetcher Worker Finished ---');
}

module.exports = runJobFetcher;

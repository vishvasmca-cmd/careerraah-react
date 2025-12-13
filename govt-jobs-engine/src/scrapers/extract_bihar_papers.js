const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

const URL = 'https://biharboardonline.com/modelpaperinter.html';
const BASE_URL = 'https://biharboardonline.com';

// Fix for legacy SSL error
const agent = new https.Agent({
    rejectUnauthorized: false,
    // Attempt to handle legacy renegotiation/security options if possible
    // In Node 17+, we might need --openssl-legacy-provider or specific crypto constants
    // But often rejectUnauthorized: false is enough for self-signed or old certs.
    // If "unsafe legacy renegotiation disabled" persists, we need strictly Node config changes
    // or a custom secureOptions.
    secureOptions: require('crypto').constants.SSL_OP_LEGACY_SERVER_CONNECT
});

async function scrapePapers() {
    console.log("🚀 Starting Bihar Board Paper Extraction (with SSL fix)...");
    try {
        const { data } = await axios.get(URL, {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const papers = [];

        // The links are usually in a table or list tags <a>
        $('a').each((i, el) => {
            const link = $(el).attr('href');
            const text = $(el).text().trim();

            // Filter for PDF links that look like model papers
            if (link && link.trim().endsWith('.pdf')) {
                let cleanLink = link.trim();
                let fullUrl;

                if (cleanLink.startsWith('http')) {
                    fullUrl = cleanLink;
                } else {
                    // Ensure exactly one slash between domain and path
                    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
                    const cleanPath = cleanLink.startsWith('/') ? cleanLink : '/' + cleanLink;
                    fullUrl = cleanBase + cleanPath;
                }

                // Fix spaces in URL if any
                fullUrl = fullUrl.replace(/ /g, '%20');

                papers.push({
                    id: i + 100, // starting ID to avoid conflict with mock
                    board: 'Bihar',
                    class: '12th', // The URL says "inter" which is 12th
                    subject: text || 'Unknown Subject',
                    year: '2025',  // Assuming current model papers
                    type: 'Model Paper',
                    url: fullUrl,
                    size: '2.5 MB' // Placeholder size as we aren't downloading yet
                });
            }
        });

        console.log(`✅ Found ${papers.length} papers`);

        // Save to a JSON file in the same directory
        const outputPath = path.join(__dirname, 'bihar_papers.json');
        fs.writeFileSync(outputPath, JSON.stringify(papers, null, 2));
        console.log(`💾 Saved to ${outputPath}`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

scrapePapers();

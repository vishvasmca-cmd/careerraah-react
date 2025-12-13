const cheerio = require('cheerio');

function parseSarkariResult(html) {
    const $ = cheerio.load(html);
    const text = $('body').text(); // Fallback for some regex

    // Helper to extract text between sections
    const getSection = (header) => {
        // Find the h2/h3 that contains the header text
        // This is tricky with Cheerio if structure varies, but let's try finding the element by text
        // and then getting next siblings until next header
        // For now, let's use a simpler Regex on the full text which seems structured in the previous step
        // Actually, scraping the visible text is safer.

        // Let's try matching lines like "Start Date to Apply Online: 25 November 2025"
        return "";
    };

    const extractValue = (keyRegex) => {
        const match = text.match(keyRegex);
        return match ? match[1].trim() : null;
    };

    const rawTitle = $('h1').first().text().trim();
    const cleanTitle = rawTitle
        .replace(/( – Apply Now| - Apply Now| \|.*|Sarkari Result|www\..*)/gi, '')
        .trim();

    const info = {
        jobTitle: cleanTitle || null,
        originalTitle: rawTitle, // Keep original just in case
        department: $('h2').first().text().trim() || 'Government',
        applicationStartDate: extractValue(/Start Date.*[:\-]\s*(.*)/i) || extractValue(/Application Begin.*[:\-]\s*(.*)/i),
        applicationEndDate: extractValue(/Last Date.*[:\-]\s*(.*)/i) || extractValue(/Last Date.*Apply Online.*[:\-]\s*(.*)/i),
        examDate: extractValue(/Exam Date.*[:\-]\s*(.*)/i),
        vacancies: extractValue(/Total Posts\s*[:\-]\s*(\d+|Multiple)/i) || extractValue(/Vacancy Details.*Total\s*[:\-]\s*(\d+)/i),
        applicationFee: extractValue(/(General \/ OBC\s*[:\-]\s*Rs\.?\s*\d+\/-?)/i) || extractValue(/Application Fee.*[:\-]\s*(.*)/i),
        location: "India",
        salary: extractValue(/Pay Scale\s*[:\-]\s*(.*)/i) || extractValue(/Salary\s*[:\-]\s*(.*)/i) || "As per rules",
        selectionProcess: null,
        syllabusTopics: [],
        officialWebsite: null,
        officialNotificationLink: null,
        applyOnlineLink: null,
        importantLinks: [],
        eligibility: {
            age: extractValue(/(Maximum Age.*)/i) || extractValue(/Age Limit.*[:\-]\s*(.*)/i),
            qualification: extractValue(/Eligibility\s*[:\-]\s*(.*)/i)
        }
    };

    // Improved Eligibility Extraction Logic
    // SarkariResult often uses "Eligibility" header followed by lists
    try {
        const eligibilityHeader = $('h2').filter((i, el) => $(el).text().toLowerCase().includes('eligibility'));
        if (eligibilityHeader.length) {
            const list = eligibilityHeader.next('ul'); // Often followed by ul
            if (list.length) {
                // Capture the full list text structured
                info.eligibility.qualification = list.find('li').map((i, el) => $(el).text().trim()).get().join('; ');
            }
        }

        // Qualification extraction fallback from 'Short Information' or other paragraphs if structured parsing fails
        if (!info.eligibility.qualification) {
            const shortInfo = $('p:contains("Short Information")').text();
            if (shortInfo) {
                const match = shortInfo.match(/Eligible (.*) candidates/i);
                if (match) info.eligibility.qualification = match[1];
            }
        }
    } catch (e) { }

    // Improved Age Extraction
    try {
        const ageHeader = $('h2').filter((i, el) => $(el).text().toLowerCase().includes('age limit'));
        if (ageHeader.length) {
            const list = ageHeader.next('ul');
            if (list.length) {
                info.eligibility.age = list.find('li').map((i, el) => $(el).text().trim()).get().join('; ');
            }
        }
    } catch (e) { }

    // Improve Links extraction
    try {
        $('a').each((i, el) => {
            const t = $(el).text().toLowerCase().trim();
            const href = $(el).attr('href');
            if (!href) return;

            if (t.includes('official website')) {
                info.officialWebsite = href;
                info.importantLinks.push({ label: 'Official Website', url: href });
            } else if (t.includes('notification')) {
                info.officialNotificationLink = href; // Explicitly capture notification
                info.importantLinks.push({ label: $(el).text().trim(), url: href });
            } else if (t.includes('apply online') || t.includes('registration')) {
                info.applyOnlineLink = href;
                info.importantLinks.push({ label: $(el).text().trim(), url: href });
            }
        });
    } catch (e) { }

    return info;
}

module.exports = parseSarkariResult;

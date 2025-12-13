const supabase = require('./supabase');
const logger = require('../utils/logger');

// Helper to slugify text
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function saveJob(jobData) {
    try {
        let {
            title, department, source, url, pdf_url,
            raw_text, structured, hindi_summary,
            fingerprint, source_links, summary,
            seo_content
        } = jobData;

        // Generate preliminary SEO content (slug/title) if missing
        if (!seo_content) {
            seo_content = {
                title: title, // Already cleaned by parser
                slug: slugify(title),
                metaDescription: summary || "Govt Job Notification",
                keywords: [],
                articleBody: null // Content pending
            };
        } else if (!seo_content.slug) {
            seo_content.slug = slugify(seo_content.title || title);
        }

        // Supabase upsert or insert
        const { data, error } = await supabase
            .from('jobs')
            .upsert({
                title,
                department,
                source,
                url,
                pdf_url,
                raw_text,
                structured,
                hindi_summary,
                fingerprint,
                source_links,
                summary,
                seo_content
                // updated_at removed to match current schema
            }, { onConflict: 'url' })
            .select();

        if (error) throw error;

        logger.info(`Saved/Updated job: ${title} (Slug: ${seo_content.slug})`);
        return data;
    } catch (error) {
        logger.error('Error saving job to DB:', error);
        return null;
    }
}

module.exports = saveJob;

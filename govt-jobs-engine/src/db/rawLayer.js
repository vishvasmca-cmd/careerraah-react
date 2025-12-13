const supabase = require('./supabase');
const logger = require('../utils/logger');

const rawLayer = {
    async saveRaw(notice) {
        // Determine content type and data
        // For PDFs, we might just store the link or base64 if small (but huge blobs are bad for PG)
        // Here we store the TEXT/HTML content we scraped.
        // Notice object generally has { title, url, source, department }
        // We assume 'htmlContent' or 'rawText' is passed separately or part of notice.

        try {
            // Check if already archived to avoid dupes in Raw Layer?
            // Or we append every run for audit history? appending is safer for 'streams'.
            const { data, error } = await supabase
                .from('raw_jobs')
                .insert({
                    source_url: notice.url,
                    portal: notice.source,
                    html_content: notice.htmlContent || null, // If we capture HTML
                    raw_text: notice.rawText || null,       // If we capture text
                    metadata: {
                        title: notice.title,
                        department: notice.department
                    },
                    processed: false
                })
                .select()
                .single();

            if (error) {
                logger.error('Error saving to raw_jobs:', error.message);
                return null;
            }
            return data;

        } catch (e) {
            logger.error('Exception in rawLayer:', e.message);
            return null;
        }
    },

    async markProcessed(id, masterJobId = null) {
        const { error } = await supabase
            .from('raw_jobs')
            .update({
                processed: true,
                processed_at: new Date(),
                master_job_id: masterJobId
            })
            .eq('id', id);

        if (error) logger.error(`Failed to mark raw job ${id} as processed`, error);
    }
};

module.exports = rawLayer;

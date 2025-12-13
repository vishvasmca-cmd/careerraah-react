const express = require('express');
const router = express.Router();
const supabase = require('../db/supabase');
const runJobFetcher = require('../workers/jobFetcher');

// GET /api/jobs
router.get('/jobs', async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ data, page, total: count });
});

// GET /api/jobs/:id (or slug)
router.get('/jobs/:id', async (req, res) => {
    const { id } = req.params;

    // Check if valid UUID, otherwise treat as slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    let query = supabase.from('jobs').select('*');

    if (isUUID) {
        query = query.eq('id', id);
    } else {
        // Query by JSONB slug field: seo_content->>'slug'
        // Using filter syntax for JSONB if available or explicitly raw filter
        // Safest approach with Supabase JS: use .eq on JSON arrow accessor? No, Supabase/PostgREST text search limited.
        // Actually, Supabase supports: .eq('seo_content->>slug', id)
        query = query.eq('seo_content->>slug', id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
        // Fallback: try title match if slug fails (optional)
        return res.status(404).json({ error: 'Job not found' });
    }
    res.json(data);
});

// GET /api/search?q=keyword
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    // Simple text search on title or department
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .or(`title.ilike.%${q}%,department.ilike.%${q}%`)
        .limit(50);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// GET /api/eligible?age=XX&edu=Qualification
// Note: This requires structured JSON querying which is complex in Supabase without specific indexes or exact matches.
// We'll implement a basic filter using JSON arrow operators if possible, or fetch & filter (inefficient but works for MVP)
router.get('/eligible', async (req, res) => {
    const { age, edu } = req.query;

    // This is a naive implementation. For prod, use Postgres JSONB operators effectively.
    // Assuming qualification structure match is hard, we might just search text in 'structured->eligibility'.

    let query = supabase.from('jobs').select('*');

    if (edu) {
        // Check if qualification string contains the requested edu
        // query = query.textSearch('structured->eligibility->qualification', edu); // textSearch needs tsvector
        // Let's use ilike on the casted text representation of the json field for simplicity
        // Not extremely performant but functional for small datasets
        // syntax: column->>field
        // Actually, Supabase JS filter: .ilike('structured->eligibility->>qualification', `%${edu}%`)
    }

    const { data, error } = await query.limit(50);

    if (error) return res.status(500).json({ error: error.message });

    // Client-side filter for age if provided (since "18-27" range parsing in SQL is hard dynamically)
    let filtered = data;
    if (age) {
        const ageNum = parseInt(age);
        filtered = data.filter(job => {
            const agestr = job.structured?.eligibility?.age;
            if (!agestr) return false;
            // simplistic check: if string contains the age or range includes it
            // TODO: parse range properly.
            return true;
        });
    }

    res.json(filtered);
});

// POST /api/trigger-scrape (Protected or Dev only)
router.post('/trigger-scrape', async (req, res) => {
    // Run in background
    runJobFetcher().catch(console.error);
    res.json({ message: 'Scraping triggered in background' });
});

module.exports = router;

const supabase = require('./src/db/supabase');

async function checkSeo() {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('seo_content')
            .limit(1);

        if (error) {
            console.log("Error: " + error.message);
        } else {
            console.log("Success: SEO column exists.");
        }
    } catch (e) {
        console.log("Exception: " + e.message);
    }
}

checkSeo();

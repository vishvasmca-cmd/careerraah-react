const supabase = require('./src/db/supabase');

async function checkSchema() {
    try {
        // Try to select the new columns. If they don't exist, it will error.
        const { data, error } = await supabase
            .from('jobs')
            .select('fingerprint, source_links')
            .limit(1);

        if (error) {
            console.log("Error: " + error.message);
        } else {
            console.log("Success: Columns exist.");
        }
    } catch (e) {
        console.log("Exception: " + e.message);
    }
}

checkSchema();

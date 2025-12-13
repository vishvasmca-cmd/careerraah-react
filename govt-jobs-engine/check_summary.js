const supabase = require('./src/db/supabase');

async function checkSummary() {
    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('summary')
            .limit(1);

        if (error) {
            console.log("Error: " + error.message);
        } else {
            console.log("Success: Summary column exists.");
        }
    } catch (e) {
        console.log("Exception: " + e.message);
    }
}

checkSummary();

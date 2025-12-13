const supabase = require('./src/db/supabase');
const logger = require('./src/utils/logger');

async function check() {
    try {
        const { count, error } = await supabase.from('raw_jobs').select('*', { count: 'exact', head: true });
        if (error) {
            console.log("Error: " + error.message);
        } else {
            console.log("Success: Table exists. Count: " + count);
        }
    } catch (e) { console.log(e); }
}

check();

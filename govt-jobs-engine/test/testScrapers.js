const scrapeSSC = require('../src/scrapers/ssc');
const scrapeUPSSSC = require('../src/scrapers/upsssc');
const scrapePrivateAggregators = require('../src/scrapers/privateSources');

async function testScrapers() {
    console.log('Testing SSC Scraper...');
    try {
        const ssc = await scrapeSSC();
        console.log(`SSC Result Count: ${ssc.length}`);
        if (ssc.length > 0) console.log('Sample:', ssc[0]);
    } catch (e) { console.error('SSC Error', e); }

    console.log('\nTesting UPSSSC Scraper...');
    try {
        const upsssc = await scrapeUPSSSC();
        console.log(`UPSSSC Result Count: ${upsssc.length}`);
    } catch (e) { console.error('UPSSSC Error', e); }

    console.log('\nTesting Private Aggregators...');
    try {
        const priv = await scrapePrivateAggregators();
        console.log(`Private Result Count: ${priv.length}`);
        if (priv.length > 0) console.log('Sample:', priv[0]);
    } catch (e) { console.error('Private Error', e); }
}

testScrapers();

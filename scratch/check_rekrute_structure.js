
const cheerio = require('cheerio');

async function test() {
    try {
        const url = 'https://www.rekrute.com/offres.html?keyword=developpeur';
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const html = await res.text();
        const $ = cheerio.load(html);
        
        $('#post-data .post-id').each((i, el) => {
            const title = $(el).find('h2 a').text().trim();
            const rawDate = $(el).find('.date').text().trim().replace(/\n/g, '').replace(/\t/g, ''); 
            const locationPart = $(el).find('.info').text().trim();
            console.log(`Title: ${title}`);
            console.log(`RawDate: ${rawDate}`);
            console.log(`LocationPart: ${locationPart}`);
            console.log("---");
        });
    } catch (e) {
        console.error("Failed:", e);
    }
}

test();

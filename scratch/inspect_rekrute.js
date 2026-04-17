
async function test() {
    try {
        const res = await fetch('http://localhost:3000/');
        const text = await res.text();
        const rekruteMatch = text.match(/\{[^{}]*\"source\":\"Rekrute\"[^{}]*\}/g);
        if (rekruteMatch) {
            console.log("Found Rekrute Offers:", rekruteMatch.length);
            rekruteMatch.slice(0, 3).forEach((m, i) => {
                console.log(`Offer ${i}:`, m);
            });
        } else {
            console.log("No Rekrute offers found in HTML JSON.");
        }
    } catch (e) {
        console.error("Failed:", e);
    }
}

test();

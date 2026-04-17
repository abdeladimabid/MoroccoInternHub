
async function test() {
    try {
        const res = await fetch('http://localhost:3000/');
        const text = await res.text();
        console.log("Contains Publication:", text.includes("Publication"));
        if (text.includes("Publication")) {
            console.log("Found at index:", text.indexOf("Publication"));
            console.log("Context:", text.substring(text.indexOf("Publication") - 100, text.indexOf("Publication") + 200));
        } else {
            console.log("Publication not found in initial HTML.");
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

test();

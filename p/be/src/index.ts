import { crawlWiki } from "./crawler/wiki.crawler"
import { cleanWords } from "./processor/cleaner"
import { lemmatize } from "./processor/lemmatizer"
import { countFrequency } from "./processor/frequency"
import { saveWords } from "./modules/vocab/vocab.service"

/*
async function main() {
    try {
        console.log("🚀 Start pipeline...")

        const paragraphs = await crawlWiki("love")
        console.log(`✅ Crawled ${paragraphs.length} paragraphs`)

        const text = paragraphs.join(" ")

        const lemmas = lemmatize(text)
        console.log(`🧠 Lemmatized: ${lemmas.length} tokens`)

        const cleaned = cleanWords(lemmas)
        console.log(`🧹 Cleaned: ${cleaned.length} words`)

        const freq = countFrequency(cleaned)
        await saveWords(freq)

        const topWords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)

        console.log("🔥 Top words:")
        console.table(topWords)

    } catch (err) {
        console.error("❌ Pipeline failed:", err)
    }
}
*/

// import { getTranscript } from "./crawler/ted.crawler"

// async function main() {
//     const slug = "sir_ken_robinson_do_schools_kill_creativity";

//     const text = await getTranscript(slug);

//     console.log(text);
// }

// main();

import axios from "axios";

async function test() {
    const url = "https://www.ted.com";

    const res = await axios.get(url);
    console.log(res.status);
}

test();
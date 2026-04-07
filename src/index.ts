import { crawlWiki } from "./crawler/wiki.crawler"
import { cleanWords } from "./processor/cleaner"
import { lemmatize } from "./processor/lemmatizer"
import { countFrequency } from "./processor/frequency"
import { saveWords } from "./modules/vocab/vocab.service"

async function main() {
    try {
        console.log("🚀 Start pipeline...")

        const paragraphs = await crawlWiki("mammal")
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

main()
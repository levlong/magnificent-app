import { crawlWiki } from "../../crawler/wiki.crawler"
import { cleanWords } from "../../processor/cleaner"
import { countFrequency } from "../../processor/frequency"
import { lemmatize } from "../../processor/lemmatizer"
import { saveWords } from "./vocab.service"

export type TopicCrawlResult = {
    topic: string
    paragraphs: number
    totalWords: number
    uniqueWords: number
    topWords: Array<{
        word: string
        frequency: number
    }>
    saved: {
        created: number
        skipped: number
        failed: number
    }
}

export async function crawlVocabularyByTopic(topic: string): Promise<TopicCrawlResult> {
    const normalizedTopic = topic.trim()
    const paragraphs = await crawlWiki(normalizedTopic)
    const text = paragraphs.join(" ")
    const lemmas = lemmatize(text)
    const cleaned = cleanWords(lemmas)
    const frequency = countFrequency(cleaned)
    const topWords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, count]) => ({
            word,
            frequency: count,
        }))

    const saved = await saveWords(frequency)

    return {
        topic: normalizedTopic,
        paragraphs: paragraphs.length,
        totalWords: cleaned.length,
        uniqueWords: Object.keys(frequency).length,
        topWords,
        saved,
    }
}

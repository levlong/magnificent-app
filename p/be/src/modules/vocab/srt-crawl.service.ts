import { crawlSRT } from "../../crawler/srt.crawler"
import { cleanWords } from "../../processor/cleaner"
import { countFrequency } from "../../processor/frequency"
import { pickImportantWords, toFrequencyMap } from "../../processor/important-vocab"
import { lemmatize } from "../../processor/lemmatizer"
import { saveWords } from "./vocab.service"

export type SrtCrawlOptions = {
    minFrequency?: number
    limit?: number
}

export type SrtCrawlResult = {
    filePath: string
    lines: number
    totalWords: number
    uniqueWords: number
    importantWords: Array<{
        word: string
        frequency: number
    }>
    saved: {
        created: number
        skipped: number
        failed: number
    }
}

export async function crawlVocabularyFromSRT(
    filePath: string,
    options: SrtCrawlOptions = {},
): Promise<SrtCrawlResult> {
    const lines = crawlSRT(filePath)
    const text = lines.join(" ")
    const lemmas = lemmatize(text)
    const cleaned = cleanWords(lemmas)
    const frequency = countFrequency(cleaned)
    const importantWords = pickImportantWords(frequency, options)
    const saved = await saveWords(toFrequencyMap(importantWords))

    return {
        filePath,
        lines: lines.length,
        totalWords: cleaned.length,
        uniqueWords: Object.keys(frequency).length,
        importantWords,
        saved,
    }
}

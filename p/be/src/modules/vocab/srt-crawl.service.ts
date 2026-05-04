import { crawlSRT } from "../../crawler/srt.crawler"
import { cleanWords } from "../../processor/cleaner"
import { countFrequency } from "../../processor/frequency"
import { pickImportantWords, toFrequencyMap } from "../../processor/important-vocab"
import { lemmatize } from "../../processor/lemmatizer"
import { normalizeTranscriptLines } from "../../processor/transcript-normalizer"
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
        examplesCreated: number
        failed: number
    }
}

export async function crawlVocabularyFromSRT(
    filePath: string,
    options: SrtCrawlOptions = {},
): Promise<SrtCrawlResult> {
    const lines = normalizeTranscriptLines(crawlSRT(filePath))
    const text = lines.join(" ")
    const lemmas = lemmatize(text)
    const cleaned = cleanWords(lemmas)
    const frequency = countFrequency(cleaned)
    const importantWords = pickImportantWords(frequency, options)
    const examplesByWord = collectExamplesByWord(lines, importantWords.map(({ word }) => word))
    const saved = await saveWords(toFrequencyMap(importantWords), {
        examplesByWord,
        exampleSource: filePath,
    })

    return {
        filePath,
        lines: lines.length,
        totalWords: cleaned.length,
        uniqueWords: Object.keys(frequency).length,
        importantWords,
        saved,
    }
}

function collectExamplesByWord(lines: string[], words: string[]) {
    const examplesByWord: Record<string, string[]> = {}
    const wantedWords = new Set(words)

    for (const line of lines) {
        const lemmas = cleanWords(lemmatize(line), {
            excludeCommonWords: false,
        })

        for (const lemma of lemmas) {
            if (!wantedWords.has(lemma)) continue

            examplesByWord[lemma] = examplesByWord[lemma] ?? []

            if (!examplesByWord[lemma].includes(line)) {
                examplesByWord[lemma].push(line)
            }
        }
    }

    return examplesByWord
}

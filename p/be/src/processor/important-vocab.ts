export type ImportantWord = {
    word: string
    frequency: number
}

export function pickImportantWords(
    freq: Record<string, number>,
    options: {
        minFrequency?: number
        limit?: number
    } = {},
): ImportantWord[] {
    const minFrequency = options.minFrequency ?? 2
    const limit = options.limit ?? 100

    return Object.entries(freq)
        .filter(([, count]) => count >= minFrequency)
        .sort((a, b) => getImportanceScore(b) - getImportanceScore(a) || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([word, count]) => ({
            word,
            frequency: count,
        }))
}

function getImportanceScore([word, count]: [string, number]) {
    const lengthWeight = Math.min(word.length / 6, 1.5)

    return count * lengthWeight
}

export function toFrequencyMap(words: ImportantWord[]): Record<string, number> {
    return Object.fromEntries(words.map(({ word, frequency }) => [word, frequency]))
}

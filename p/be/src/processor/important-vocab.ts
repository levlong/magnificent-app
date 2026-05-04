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
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, limit)
        .map(([word, count]) => ({
            word,
            frequency: count,
        }))
}

export function toFrequencyMap(words: ImportantWord[]): Record<string, number> {
    return Object.fromEntries(words.map(({ word, frequency }) => [word, frequency]))
}

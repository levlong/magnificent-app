export function countFrequency(words: string[]) {
    const freq: Record<string, number> = {}

    for (const w of words) {
        freq[w] = (freq[w] || 0) + 1
    }

    return freq
}
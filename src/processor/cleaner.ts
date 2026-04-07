const STOPWORDS = new Set([
    "the", "a", "an", "is", "are", "was", "were",
    "to", "of", "and", "in", "on", "for", "with",
    "that", "this", "it"
])

export function cleanWords(words: string[]): string[] {
    return words
        .map(w => w.toLowerCase())
        .filter(w => w.match(/^[a-z]+$/)) // chỉ giữ chữ
        .filter(w => w.length > 2)        // bỏ từ ngắn
        .filter(w => !STOPWORDS.has(w))   // bỏ stopwords
}
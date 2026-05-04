import { COMMON_WORDS } from "./common-words"

export function cleanWords(words: string[]): string[] {
    return words
        .map(w => w.toLowerCase())
        .filter(w => w.match(/^[a-z]+$/)) // chỉ giữ chữ
        .filter(w => w.length > 2)        // bỏ từ ngắn
        .filter(w => !COMMON_WORDS.has(w)) // bỏ stopwords/common words
}

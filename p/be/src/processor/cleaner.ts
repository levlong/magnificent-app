import { COMMON_WORDS } from "./common-words"

export type CleanWordOptions = {
    minLength?: number
    excludeCommonWords?: boolean
}

export function cleanWords(
    words: string[],
    options: CleanWordOptions = {},
): string[] {
    const minLength = options.minLength ?? 3
    const excludeCommonWords = options.excludeCommonWords ?? true

    return words
        .map(w => w.toLowerCase())
        .filter(w => w.match(/^[a-z]+$/))
        .filter(w => w.length >= minLength)
        .filter(w => !excludeCommonWords || !COMMON_WORDS.has(w))
}

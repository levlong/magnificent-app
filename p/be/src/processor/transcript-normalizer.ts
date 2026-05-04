const CONTRACTIONS: Array<[RegExp, string]> = [
    [/\bcan't\b/gi, "cannot"],
    [/\bwon't\b/gi, "will not"],
    [/\bn't\b/gi, " not"],
    [/\bI'm\b/gi, "I am"],
    [/\b([A-Za-z]+)'re\b/g, "$1 are"],
    [/\b([A-Za-z]+)'ve\b/g, "$1 have"],
    [/\b([A-Za-z]+)'ll\b/g, "$1 will"],
    [/\b([A-Za-z]+)'d\b/g, "$1 would"],
    [/\b([A-Za-z]+)'m\b/g, "$1 am"],
    [/\b([A-Za-z]+)'s\b/g, "$1"],
]

export function normalizeTranscriptLine(line: string): string {
    let normalized = line
        .replace(/^\uFEFF/, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\{[^}]+\}/g, " ")
        .replace(/\[[^\]]+\]/g, " ")
        .replace(/\([^)]*\)/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/[♪♫]/g, " ")
        .replace(/^[-\s]*[A-Z][A-Z\s'.-]{1,30}:\s+/, "")

    for (const [pattern, replacement] of CONTRACTIONS) {
        normalized = normalized.replace(pattern, replacement)
    }

    return normalized
        .replace(/[^\S\r\n]+/g, " ")
        .replace(/\s+([,.!?;:])/g, "$1")
        .trim()
}

export function normalizeTranscriptLines(lines: string[]): string[] {
    return lines
        .map(normalizeTranscriptLine)
        .filter(line => line.length > 0)
}

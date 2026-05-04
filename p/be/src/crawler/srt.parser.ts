import { normalizeTranscriptLine } from "../processor/transcript-normalizer"

export function parseSRT(content: string): string[] {
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => {
            return (
                line &&
                !line.match(/^\\d+$/) && // remove index
                !line.includes("-->")    // remove timestamp
            )
        })
        .map(normalizeTranscriptLine)
        .filter(line => line.length > 0)
}

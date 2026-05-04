import axios from "axios"

export async function crawlWiki(title: string): Promise<string[]> {
    const normalizedTitle = title.trim().replace(/\s+/g, "_")
    const url = `https://simple.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedTitle)}`

    const { data } = await axios.get(url, {
        headers: {
            "User-Agent": "vocab-app/1.0 (learning project)",
            "Accept": "application/json",
        },
    })

    if (!data.extract) return []

    return [data.extract]
}

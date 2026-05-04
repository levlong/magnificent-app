import { Request, Response } from "express"
import { getAllWords, getWordById } from "./vocab.service"
import { crawlVocabularyFromSRT, type SrtCrawlOptions } from "./srt-crawl.service"
import { crawlVocabularyByTopic } from "./topic-crawl.service"

export async function getWords(req: Request, res: Response) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const data = await getAllWords(page, limit)

    res.json(data)
}

export async function crawlTopic(req: Request, res: Response) {
    const topic = typeof req.body.topic === "string" ? req.body.topic.trim() : ""

    if (!topic) {
        return res.status(400).json({ message: "topic is required" })
    }

    try {
        const data = await crawlVocabularyByTopic(topic)

        if (data.paragraphs === 0) {
            return res.status(404).json({ message: "No content found for topic", topic })
        }

        res.status(201).json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to crawl topic", topic })
    }
}

export async function crawlSrt(req: Request, res: Response) {
    const filePath = typeof req.body.filePath === "string" ? req.body.filePath.trim() : ""
    const minFrequency = Number(req.body.minFrequency)
    const limit = Number(req.body.limit)

    if (!filePath) {
        return res.status(400).json({ message: "filePath is required" })
    }

    if (!filePath.endsWith(".srt")) {
        return res.status(400).json({ message: "filePath must point to an .srt file" })
    }

    try {
        const options: SrtCrawlOptions = {}

        if (Number.isFinite(minFrequency) && minFrequency > 0) {
            options.minFrequency = minFrequency
        }

        if (Number.isFinite(limit) && limit > 0) {
            options.limit = limit
        }

        const data = await crawlVocabularyFromSRT(filePath, options)

        res.status(201).json(data)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to crawl SRT file", filePath })
    }
}

export async function getWord(req: Request, res: Response) {
    const id = Number(req.params.id)

    const data = await getWordById(id)

    if (!data) {
        return res.status(404).json({ message: "Word not found" })
    }

    res.json(data)
}

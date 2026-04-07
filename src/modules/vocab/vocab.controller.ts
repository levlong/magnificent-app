import { Request, Response } from "express"
import { getAllWords, getWordById } from "./vocab.service"

export async function getWords(req: Request, res: Response) {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const data = await getAllWords(page, limit)

    res.json(data)
}

export async function getWord(req: Request, res: Response) {
    const id = Number(req.params.id)

    const data = await getWordById(id)

    if (!data) {
        return res.status(404).json({ message: "Word not found" })
    }

    res.json(data)
}
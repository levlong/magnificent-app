import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client"
import { getWordData } from "../dictionary/dictionary.service"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

type SaveWordsOptions = {
    examplesByWord?: Record<string, string[]>
    exampleSource?: string
}

export async function saveWords(
    freq: Record<string, number>,
    options: SaveWordsOptions = {},
) {
    const result = {
        created: 0,
        skipped: 0,
        examplesCreated: 0,
        failed: 0,
    }

    for (const [word, count] of Object.entries(freq)) {
        try {
            const existing = await prisma.word.findUnique({
                where: { text: word },
            })

            if (existing) {
                result.skipped++
                result.examplesCreated += await saveExamples(
                    existing.id,
                    options.examplesByWord?.[word] ?? [],
                    options.exampleSource ?? "unknown",
                )
                continue
            }

            const data = await getWordData(word)

            const newWord = await prisma.word.create({
                data: {
                    text: word,
                    frequency: count,
                },
            })

            if (data?.definition) {
                await prisma.meaning.create({
                    data: {
                        wordId: newWord.id,
                        definition: data.definition,
                        phonetic: data.phonetic,
                    },
                })
            }

            if (data?.example) {
                await prisma.example.create({
                    data: {
                        wordId: newWord.id,
                        sentence: data.example,
                        source: "dictionaryapi.dev",
                    },
                })
            }

            result.examplesCreated += await saveExamples(
                newWord.id,
                options.examplesByWord?.[word] ?? [],
                options.exampleSource ?? "unknown",
            )
            result.created++
        } catch (err) {
            console.error(err)
            console.log("skip word:", word)
            result.failed++
        }
    }

    return result
}

async function saveExamples(wordId: number, sentences: string[], source: string) {
    let created = 0

    for (const sentence of sentences.slice(0, 3)) {
        const existing = await prisma.example.findFirst({
            where: {
                wordId,
                sentence,
                source,
            },
        })

        if (existing) continue

        await prisma.example.create({
            data: {
                wordId,
                sentence,
                source,
            },
        })

        created++
    }

    return created
}

export async function getAllWords(page: number, limit: number) {
    const skip = (page - 1) * limit

    const words = await prisma.word.findMany({
        skip,
        take: limit,
        include: {
            meanings: true,
            examples: true,
        },
        orderBy: {
            frequency: "desc",
        },
    })

    return words
}

export async function getWordById(id: number) {
    return prisma.word.findUnique({
        where: { id },
        include: {
            meanings: true,
            examples: true,
        },
    })
}

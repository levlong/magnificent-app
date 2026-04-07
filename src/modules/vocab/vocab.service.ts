import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client"
import { getWordData } from "../dictionary/dictionary.service"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export async function saveWords(freq: Record<string, number>) {
    for (const [word, count] of Object.entries(freq)) {
        try {
            const existing = await prisma.word.findUnique({
                where: { text: word },
            })

            if (existing) continue

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

        } catch (err) {
            console.error(err)
            console.log("skip word:", word)
        }
    }
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
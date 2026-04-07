import { api } from "./client"

export async function getWords() {
    const res = await api.get("/vocab?page=1&limit=10")
    return res.data
}
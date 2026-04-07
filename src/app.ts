import express from "express"
import vocabRoutes from "./routes/vocab.routes"

const app = express()

app.use(express.json())

app.use("/api/v1/vocab", vocabRoutes)

export default app
import express, { type Express } from "express"
import vocabRoutes from "./routes/vocab.routes"

const app: Express = express()

app.use(express.json())

app.use("/api/v1/vocab", vocabRoutes)

export default app

import { Router, type Router as RouterType } from "express"
import { crawlTopic, getWords, getWord } from "../modules/vocab/vocab.controller"

const router: RouterType = Router()

router.get("/", getWords)
router.post("/crawl-topic", crawlTopic)
router.get("/:id", getWord)

export default router

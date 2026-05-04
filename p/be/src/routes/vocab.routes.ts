import { Router, type Router as RouterType } from "express"
import { crawlSrt, crawlTopic, getWords, getWord } from "../modules/vocab/vocab.controller"

const router: RouterType = Router()

router.get("/", getWords)
router.post("/crawl-srt", crawlSrt)
router.post("/crawl-topic", crawlTopic)
router.get("/:id", getWord)

export default router

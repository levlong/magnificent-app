import { Router, type Router as RouterType } from "express"
import { getWords, getWord } from "../modules/vocab/vocab.controller"

const router: RouterType = Router()

router.get("/", getWords)
router.get("/:id", getWord)

export default router
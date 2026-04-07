import * as fs from "fs"
import * as path from "path"
import { parseSRT } from "./srt.parser"

export function crawlSRT(filePath: string): string[] {
    const fullPath = path.resolve(filePath)
    const content = fs.readFileSync(fullPath, "utf-8")

    return parseSRT(content)
}
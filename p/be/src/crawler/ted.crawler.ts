export interface Cue {
    text: string;
    time: number;
}

export interface Paragraph {
    cues: Cue[];
}

export interface TranscriptResponse {
    paragraphs: Paragraph[];
}

import * as cheerio from "cheerio";

export async function getTranscript(slug: string) {
    const url = `https://www.ted.com/talks/${slug}/transcript`;

    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const texts: string[] = [];

    $("div[data-testid='cue']").each((_, el) => {
        texts.push($(el).text());
    });

    return texts.join(" ");
}
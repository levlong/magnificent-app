import winkNLP from "wink-nlp"
import model from "wink-eng-lite-web-model"

const nlp = winkNLP(model)

export function tokenize(text: string): string[] {
    const doc = nlp.readDoc(text)

    return doc.tokens().out()
}
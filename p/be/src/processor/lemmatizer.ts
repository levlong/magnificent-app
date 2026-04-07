import winkNLP from "wink-nlp"
import model from "wink-eng-lite-web-model"

const nlp = winkNLP(model)

export function lemmatize(text: string): string[] {
    const doc = nlp.readDoc(text)

    return doc.tokens().out(nlp.its.lemma as any)
}
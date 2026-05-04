# Backend Documentation

This backend powers the vocabulary learning app. It crawls text sources, preprocesses words, enriches vocabulary with dictionary data, stores results in PostgreSQL, and exposes REST APIs for the frontend.

## Runtime

- Node.js + TypeScript
- Express REST API
- PostgreSQL
- Prisma Client generated into `src/generated/prisma`
- `wink-nlp` with `wink-eng-lite-web-model` for English lemmatization
- `dictionaryapi.dev` for definitions, phonetics, and dictionary examples

The server entrypoint is `src/server.ts`. It starts Express on port `3000` and mounts vocabulary routes under:

```txt
/api/v1/vocab
```

## Current Flow

### Topic Crawl

```txt
POST /api/v1/vocab/crawl-topic
        |
        v
controller: crawlTopic
        |
        v
topic-crawl.service.ts
        |
        v
crawlWiki(topic)
        |
        v
lemmatize text -> clean words -> count frequency
        |
        v
saveWords(freq)
        |
        v
dictionaryapi.dev -> Word / Meaning / Example tables
```

Topic crawl reads a Simple Wikipedia page summary for the requested topic. It extracts the summary text, lemmatizes it, filters common words, counts word frequency, saves unique words, and enriches each new word with dictionary data.

### SRT Crawl

```txt
POST /api/v1/vocab/crawl-srt
        |
        v
controller: crawlSrt
        |
        v
srt-crawl.service.ts
        |
        v
crawlSRT(filePath) -> parseSRT(content)
        |
        v
normalize transcript lines
        |
        v
lemmatize text -> clean words -> count frequency
        |
        v
pick important words
        |
        v
collect context examples from transcript
        |
        v
saveWords(freq, examplesByWord)
        |
        v
dictionaryapi.dev + transcript examples -> DB
```

SRT crawl reads a local `.srt` file, removes subtitle indexes and timestamps, normalizes transcript noise, extracts important vocabulary, and saves up to 3 transcript context sentences per word.

## Available APIs

### `GET /api/v1/vocab`

Returns paginated words sorted by frequency descending. Includes meanings and examples.

Query params:

- `page`: page number. Default: `1`.
- `limit`: number of words per page. Default: `10`.

Example:

```bash
curl "http://localhost:3000/api/v1/vocab?page=1&limit=10"
```

Response shape:

```json
[
  {
    "id": 1,
    "text": "creativity",
    "frequency": 4,
    "createdAt": "2026-05-04T00:00:00.000Z",
    "meanings": [
      {
        "id": 1,
        "wordId": 1,
        "definition": "The ability to create something.",
        "phonetic": "/..."
      }
    ],
    "examples": [
      {
        "id": 1,
        "wordId": 1,
        "sentence": "Schools kill creativity.",
        "source": "p/be/src/data/sample.srt"
      }
    ]
  }
]
```

### `GET /api/v1/vocab/:id`

Returns one word by id. Includes meanings and examples.

Example:

```bash
curl "http://localhost:3000/api/v1/vocab/1"
```

Errors:

- `404`: word not found

### `POST /api/v1/vocab/crawl-topic`

Crawls vocabulary from a Simple Wikipedia topic.

Body:

```json
{
  "topic": "love"
}
```

Example:

```bash
curl -X POST "http://localhost:3000/api/v1/vocab/crawl-topic" \
  -H "Content-Type: application/json" \
  -d '{"topic":"love"}'
```

Response shape:

```json
{
  "topic": "love",
  "paragraphs": 1,
  "totalWords": 42,
  "uniqueWords": 31,
  "topWords": [
    {
      "word": "affection",
      "frequency": 2
    }
  ],
  "saved": {
    "created": 12,
    "skipped": 19,
    "examplesCreated": 0,
    "failed": 0
  }
}
```

Errors:

- `400`: `topic` is missing
- `404`: no content found for the topic
- `500`: crawl or save failed

### `POST /api/v1/vocab/crawl-srt`

Crawls vocabulary from a local `.srt` file.

Body:

```json
{
  "filePath": "p/be/src/data/sample.srt",
  "minFrequency": 2,
  "limit": 100
}
```

Fields:

- `filePath`: required local path to an `.srt` file.
- `minFrequency`: optional minimum frequency before a word is kept. Default: `2`.
- `limit`: optional maximum number of important words to save. Default: `100`.

Example:

```bash
curl -X POST "http://localhost:3000/api/v1/vocab/crawl-srt" \
  -H "Content-Type: application/json" \
  -d '{"filePath":"p/be/src/data/sample.srt","minFrequency":2,"limit":100}'
```

Response shape:

```json
{
  "filePath": "p/be/src/data/sample.srt",
  "lines": 120,
  "totalWords": 430,
  "uniqueWords": 180,
  "importantWords": [
    {
      "word": "creativity",
      "frequency": 4
    }
  ],
  "saved": {
    "created": 20,
    "skipped": 80,
    "examplesCreated": 45,
    "failed": 0
  }
}
```

Errors:

- `400`: `filePath` is missing
- `400`: `filePath` does not end with `.srt`
- `500`: read, crawl, enrich, or save failed

## Modules

### App Entrypoints

- `src/server.ts`: loads environment variables, imports Express app, starts port `3000`.
- `src/app.ts`: creates Express app, enables JSON body parsing, mounts vocab routes.
- `src/routes/vocab.routes.ts`: defines available vocabulary endpoints.

### Crawler

- `src/crawler/wiki.crawler.ts`
  - Calls Simple Wikipedia REST summary API.
  - Normalizes topic names by trimming spaces, replacing spaces with `_`, and URL-encoding the title.
  - Returns an array of paragraph strings.

- `src/crawler/srt.crawler.ts`
  - Reads a local subtitle file from disk.
  - Delegates parsing to `parseSRT`.

- `src/crawler/srt.parser.ts`
  - Removes subtitle indexes.
  - Removes timestamp lines.
  - Normalizes transcript lines.

- `src/crawler/ted.crawler.ts`
  - Experimental TED transcript crawler.
  - Not currently mounted in any API flow.

### Processor

- `src/processor/transcript-normalizer.ts`
  - Removes subtitle noise like HTML tags, `{...}`, `[...]`, `(...)`, music symbols, and speaker labels.
  - Expands common contractions like `can't`, `won't`, `I'm`, `they're`.
  - Normalizes whitespace.

- `src/processor/lemmatizer.ts`
  - Uses `wink-nlp` to convert text into lemmas.
  - Example intent: `went -> go`, `schools -> school`.

- `src/processor/cleaner.ts`
  - Lowercases words.
  - Keeps alphabetic tokens only.
  - Removes short tokens.
  - Removes common words by default.

- `src/processor/common-words.ts`
  - Defines filtered word groups:
    - `STOP_WORDS`: grammar/function words.
    - `DISCOURSE_WORDS`: subtitle filler words like `yeah`, `okay`, `uh`.
    - `HIGH_FREQUENCY_WORDS`: frequent words that are usually low value for vocabulary extraction.
  - Exports `COMMON_WORDS` as the union of those groups.

- `src/processor/frequency.ts`
  - Counts word occurrences into `Record<string, number>`.

- `src/processor/important-vocab.ts`
  - Filters words by minimum frequency.
  - Sorts words by an importance score based on frequency and word length.
  - Converts selected words back to a frequency map for persistence.

- `src/processor/tokenizer.ts`
  - Tokenizes text with `wink-nlp`.
  - Currently not used by the active API flows because `lemmatizer.ts` already reads the text through `wink-nlp`.

### Dictionary

- `src/modules/dictionary/dictionary.service.ts`
  - Calls `https://api.dictionaryapi.dev/api/v2/entries/en/:word`.
  - Returns phonetic, first definition, and first dictionary example when available.
  - Returns `null` when the dictionary lookup fails.

### Vocabulary

- `src/modules/vocab/vocab.controller.ts`
  - Handles HTTP validation and response status codes.
  - Delegates work to vocabulary services.

- `src/modules/vocab/topic-crawl.service.ts`
  - Runs the topic pipeline:
    `wiki -> lemmatize -> clean -> frequency -> save`.

- `src/modules/vocab/srt-crawl.service.ts`
  - Runs the SRT pipeline:
    `srt -> normalize -> lemmatize -> clean -> frequency -> important words -> context examples -> save`.

- `src/modules/vocab/vocab.service.ts`
  - Owns Prisma read/write operations for words, meanings, and examples.
  - Avoids duplicate words using unique `Word.text`.
  - Saves dictionary examples and SRT context examples.
  - Reads paginated word lists and word details.

### Database

Prisma schema: `prisma/schema.prisma`

Tables:

- `Word`
  - `id`
  - `text`
  - `frequency`
  - `createdAt`

- `Meaning`
  - `id`
  - `wordId`
  - `definition`
  - `phonetic`

- `Example`
  - `id`
  - `wordId`
  - `sentence`
  - `source`

Relationships:

- One `Word` has many `Meaning`.
- One `Word` has many `Example`.

## Local Development

Start PostgreSQL:

```bash
cd p/be
docker compose up -d
```

Configure `.env`:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/vocab"
```

Start backend:

```bash
pnpm --filter be dev
```

Run TypeScript check:

```bash
pnpm --filter be exec tsc --noEmit --ignoreDeprecations 6.0
```

The `--ignoreDeprecations 6.0` flag is currently needed because the shared TypeScript config uses `baseUrl`, which TypeScript 6 reports as deprecated.

## Current Limitations

- Topic crawl currently saves all cleaned topic words, while SRT crawl saves selected important words.
- Dictionary enrichment runs one word at a time and can be slow for large crawls.
- There is no dictionary cache yet, so repeated misses still call the external dictionary API for new words.
- `src/index.ts` contains manual experiment code and is not the production server entrypoint.
- TED crawler exists but is not wired into API routes.
- API responses do not include pagination metadata yet.

## TODO

- Add an automated daily vocabulary crawl job.
  - Example schedule: every day at `00:00`.
  - Suggested implementation:
    - Add a job module, for example `src/jobs/daily-vocab-crawl.job.ts`.
    - Use a scheduler such as `node-cron`.
    - Configure topics or SRT file paths through environment variables.
    - Run the job from `server.ts` after the API starts.
    - Add a lock or job-run table later to avoid duplicate runs when multiple backend instances are running.

- Add dictionary lookup caching.
- Add pagination metadata to `GET /api/v1/vocab`.
- Add API tests for controller validation.
- Add processor unit tests for transcript normalization, cleaning, and important-word ranking.
- Add a mounted TED crawl API only after the transcript crawler is stable.

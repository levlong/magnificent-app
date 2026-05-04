# Language Learning App Backend

Current backend docs are in [docs/backend.md](docs/backend.md).

The notes below are the original development plan and may include planned APIs that are not implemented yet.

---

# 🚀 Language Learning App – Development Plan

## 🎯 Goal

Build a vocab learning app with:

* Backend: crawl → process → store → API
* Frontend: React Native app to consume API

---

# 🧱 1. Architecture Overview

## Backend

* Crawl data (SRT + Simple Wikipedia)
* Process text (tokenize, clean, lemmatize, frequency)
* Enrich data (dictionary API)
* Store in PostgreSQL
* Expose REST API

## Frontend

* React Native (Expo + TypeScript)
* Fetch vocab data from backend
* Display flashcards + context learning

---

# ⚙️ 2. Backend Plan

## 2.1 Setup

* Node.js + TypeScript
* Package manager: pnpm
* ORM: Prisma
* Database: PostgreSQL

---

## 2.2 Modules

### 📦 Module 1: Crawler

**Goal:** Get raw text data

Sources:

* SRT subtitles
* Simple Wikipedia

Tasks:

* Read `.srt` files
* Crawl wiki pages (HTML → text)
* Normalize output → array of sentences

Output:

```
string[] // sentences
```

---

### 🧠 Module 2: Processor

**Goal:** Convert raw text → vocab data

Steps:

1. Tokenize
2. Clean (remove punctuation, stopwords)
3. Lemmatize (went → go)
4. Count frequency

Output:

```
{
  word: string
  frequency: number
}
```

---

### 📚 Module 3: Enrichment

**Goal:** Add meaning + phonetic + example

Use:

* dictionaryapi.dev

Output:

```
{
  word,
  phonetic,
  definition,
  example
}
```

---

### 🗄 Module 4: Database

Tables:

* Word
* Meaning
* Example

Responsibilities:

* Save processed words
* Avoid duplicates
* Store frequency + context

---

### 🔌 Module 5: API Layer

Endpoints:

#### GET /words

* Return list of words
* Support pagination

#### GET /words/:id

* Return word details

#### GET /learn

* Return random words (for learning)

#### POST /user/word

* Save user progress

---

### 🔄 Module 6: Pipeline Job

Flow:

```
crawl → process → enrich → save
```

Run:

* Manual (dev)
* Cron job (later)

---

# 📱 3. Frontend Plan (React Native)

## 3.1 Setup

* Expo + TypeScript
* State: Zustand

---

## 3.2 Screens

### 🧠 Home Screen

* Show daily words

### 📖 Flashcard Screen

* Word
* Meaning
* Example
* Flip animation

### 📊 Progress Screen

* Learned words
* Stats

---

## 3.3 API Integration

* Fetch words from backend
* Cache locally (AsyncStorage)

---

# 🛠 4. Development Phases

## Phase 1 (MVP Backend)

* Parse SRT
* Tokenize + frequency
* Save DB

## Phase 2 (Enrichment)

* Add dictionary API

## Phase 3 (API)

* Build REST endpoints

## Phase 4 (Frontend)

* Build basic UI
* Connect API

## Phase 5 (Enhancement)

* Add SRS (spaced repetition)
* Add user tracking

---

# ⚠️ Risks & Notes

* API rate limit → need caching
* Data noise → need filtering
* Performance → batch processing

---

# 🧠 Core Principle

❌ Not: word → meaning

✅ Yes: context → understanding → memory

---

# 🚀 Next Step

👉 Start with:

1. Setup backend project
2. Implement SRT crawler
3. Build tokenizer + frequency counter

Then continue step-by-step.

# How to
## Run

1. Run Postgresql with Docker:
```bash
docker run -d \                              
  --name vocab-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=vocab \
  -p 5432:5432 \
  postgres

```

2. Install dependencies
```bash
pnpm install
```

3. Create .env file
```bash
cp .example.env .env
```

4. Create Prisma Client
```bash
npx prisma generate
```

5. Sync schema
```bash
npx prisma migrate dev
```

6. Run
```bash
pnpm ts-node-dev src/server.ts
```

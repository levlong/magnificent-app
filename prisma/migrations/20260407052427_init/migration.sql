-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meaning" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "definition" TEXT NOT NULL,
    "phonetic" TEXT,

    CONSTRAINT "Meaning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Example" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "sentence" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_text_key" ON "Word"("text");

-- AddForeignKey
ALTER TABLE "Meaning" ADD CONSTRAINT "Meaning_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

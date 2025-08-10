-- CreateTable
CREATE TABLE "Idea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "tags" JSONB NOT NULL DEFAULT [],
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Idea_created_at_idx" ON "Idea"("created_at");

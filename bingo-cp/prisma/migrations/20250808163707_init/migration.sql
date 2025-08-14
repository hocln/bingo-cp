-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "teams" JSONB NOT NULL,
    "startTime" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "problems" JSONB NOT NULL
);

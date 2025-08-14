/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `problems` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teams` on the `Match` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Problem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "matchId" TEXT,
    CONSTRAINT "Problem_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "matchId" TEXT,
    CONSTRAINT "Team_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SolveLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "matchId" TEXT,
    CONSTRAINT "SolveLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Match" ("id") SELECT "id" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

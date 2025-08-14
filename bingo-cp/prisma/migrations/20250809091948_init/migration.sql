/*
  Warnings:

  - You are about to drop the column `index` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Match` table. All the data in the column will be lost.
  - Made the column `durationMinutes` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mode` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL
);
INSERT INTO "new_Match" ("durationMinutes", "id", "mode", "startTime") SELECT "durationMinutes", "id", "mode", "startTime" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_Problem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "matchId" TEXT,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Problem_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Problem" ("contestId", "id", "index", "matchId") SELECT "contestId", "id", "index", "matchId" FROM "Problem";
DROP TABLE "Problem";
ALTER TABLE "new_Problem" RENAME TO "Problem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `duration` on the `Match` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT,
    "startTime" DATETIME,
    "durationMinutes" INTEGER
);
INSERT INTO "new_Match" ("id", "mode", "startTime") SELECT "id", "mode", "startTime" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

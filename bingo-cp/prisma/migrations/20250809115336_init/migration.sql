/*
  Warnings:

  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `matchId` on table `Problem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `matchId` on table `SolveLog` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Problem" (
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("contestId", "index", "matchId"),
    CONSTRAINT "Problem_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Problem" ("contestId", "index", "matchId", "name", "rating") SELECT "contestId", "index", "matchId", "name", "rating" FROM "Problem";
DROP TABLE "Problem";
ALTER TABLE "new_Problem" RENAME TO "Problem";
CREATE TABLE "new_SolveLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "handle" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "matchId" TEXT NOT NULL,
    CONSTRAINT "SolveLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SolveLog_contestId_index_matchId_fkey" FOREIGN KEY ("contestId", "index", "matchId") REFERENCES "Problem" ("contestId", "index", "matchId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SolveLog" ("contestId", "handle", "id", "index", "matchId", "team", "timestamp") SELECT "contestId", "handle", "id", "index", "matchId", "team", "timestamp" FROM "SolveLog";
DROP TABLE "SolveLog";
ALTER TABLE "new_SolveLog" RENAME TO "SolveLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

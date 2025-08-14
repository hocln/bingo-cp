-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Problem" (
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("contestId", "index", "matchId"),
    CONSTRAINT "Problem_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Problem" ("contestId", "index", "matchId", "name", "rating") SELECT "contestId", "index", "matchId", "name", "rating" FROM "Problem";
DROP TABLE "Problem";
ALTER TABLE "new_Problem" RENAME TO "Problem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - A unique constraint covering the columns `[matchId,position]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[matchId,contestId,index]` on the table `SolveLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Problem_matchId_idx" ON "Problem"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_matchId_position_key" ON "Problem"("matchId", "position");

-- CreateIndex
CREATE INDEX "SolveLog_matchId_idx" ON "SolveLog"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "SolveLog_matchId_contestId_index_key" ON "SolveLog"("matchId", "contestId", "index");

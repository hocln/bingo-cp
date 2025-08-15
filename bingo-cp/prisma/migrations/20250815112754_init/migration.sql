-- CreateEnum
CREATE TYPE "public"."MatchMode" AS ENUM ('replace', 'classic', 'ioi');

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" TEXT NOT NULL,
    "mode" "public"."MatchMode" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "replaceIncrement" INTEGER DEFAULT 100,
    "minRating" INTEGER,
    "maxRating" INTEGER,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Problem" (
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "maxPoints" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("contestId","index","matchId")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "matchId" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" SERIAL NOT NULL,
    "handle" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolveLog" (
    "id" SERIAL NOT NULL,
    "handle" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "contestId" INTEGER NOT NULL,
    "index" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "score" INTEGER,
    "matchId" TEXT NOT NULL,

    CONSTRAINT "SolveLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Problem" ADD CONSTRAINT "Problem_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Member" ADD CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolveLog" ADD CONSTRAINT "SolveLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolveLog" ADD CONSTRAINT "SolveLog_contestId_index_matchId_fkey" FOREIGN KEY ("contestId", "index", "matchId") REFERENCES "public"."Problem"("contestId", "index", "matchId") ON DELETE RESTRICT ON UPDATE CASCADE;

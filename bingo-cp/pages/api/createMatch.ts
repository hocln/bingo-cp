import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/app/lib/prisma';
import { Prisma, MatchMode } from '@prisma/client';

type ProblemWithGrid = {
  contestId: number;
  index: string;
  row: number;
  col: number;
  name: string;
  rating: number;
  maxPoints: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const {
    startTime,
    durationMinutes,
    minRating,
    maxRating,
    replaceIncrement,
    mode,
    gridSize,
    teams,
  } = req.body as {
    startTime: string;
    durationMinutes: number;
    minRating: number;
    maxRating: number;
    replaceIncrement: number;
    mode: MatchMode;
    gridSize: number;
    teams: Array<{
      name: string;
      color: string;
      members: string[];
    }>;
  };
  const Cmode = mode;

  const allHandles = teams.flatMap((team) => team.members);
  try {
    let problemData;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const problemRes = await fetch(`${baseUrl}/api/getProblems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userHandles: allHandles,
        minRating,
        maxRating,
        count: gridSize * gridSize,
      }),
    })
    if (!problemRes.ok) return res.status(500).json({ error: 'Failed to fetch problems' })
    problemData = await problemRes.json()
    const problems: ProblemWithGrid[] = problemData.problems.map(
      (p: { contestId: number; index: string, rating: number, name: string }, idx: number) => ({
        contestId: p.contestId,
        index: p.index,
        row: Math.floor(idx / gridSize),
        col: idx % gridSize,
        rating: p.rating,
        name: p.name,
      })
    );
    // console.time("match");
    const match = await prisma.match.create({
      data: {
        mode: Cmode,
        startTime: new Date(startTime),
        durationMinutes,
        replaceIncrement: Cmode === 'replace' ? Number(replaceIncrement ?? 100) : undefined, // maybe validate later
        minRating: minRating ?? undefined,
        maxRating: maxRating ?? undefined,
      },
    });
    // console.timeEnd("match");
    const data= problems.map((p) => ({
        contestId: p.contestId,
        index: p.index,
        matchId: match.id,
        rating: p.rating,
        name: p.name,
      }));
      let x;
      problems.map((p) => ({
        x: p.contestId,
      }));
      // console.time("createMany");
      await prisma.problem.createMany({
        data: problems.map((p) => ({
          // console.log("P: ", p.contestId);
          contestId: p.contestId ?? 1242,
          index: p.index,
          matchId: match.id,
          rating: p.rating ?? 0,
          name: p.name,
          position: p.row * gridSize + p.col,
          maxPoints: undefined,
          active: true,
        })),
      });
      // console.timeEnd("createMany");

    for (const team of teams) {
      const createdTeam = await prisma.team.create({
        data: {
          name: team.name,
          color: team.color,
          matchId: match.id,
        },
      });

      await prisma.member.createMany({
        data: team.members.map((handle) => ({
          handle,
          teamId: createdTeam.id,
        })),
      });
    }
    const fullMatch = await prisma.match.findUnique({
      where: { id: match.id },
      include: {
        teams: {
          include: {
            members: true,
          },
        },
        problems: true,
        solveLog: {include : {problem: true}}, // i changed it
      },
    });

  return res.status(200).json({id: match.id});
  } catch (error) {
    console.error("Match creation failed", error);
    return res.status(500).json({ error: 'Match creation failed' });
  }
}

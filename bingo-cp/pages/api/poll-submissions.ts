import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../src/app/lib/prisma"
import { checkSolvesLogic } from './checkSolvesLogic'
async function fetchReplacementProblem(exclude: string[], minRating?: number, maxRating?: number, handles?: string[] ) {
  try {
    const res = await fetch('/api/getProblems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        minRating: minRating ?? 800,
        maxRating: maxRating ?? 3500,
        userHandles: handles,
        count: 1,
        exculde: exclude
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.problems && data.problems[0]) ?? null;
  } catch (err) {
    console.error('fetchReplacementProblem error', err);
    return null;
  }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    const { matchId } = req.body
    if (!matchId) return res.status(400).json({ error: 'matchId required' })
     const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        problems: true,
        teams: {
          include: { members: true },
        },
        solveLog: {include: {problem: true}}, // maybe change to entirely true later
      },
    })

    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }
    const problems = match.problems
    .filter(p => p.active === true)
    .map(p => ({
      contestId: p.contestId,
      index: p.index,
    }));
    const players = match.teams.flatMap(team =>
      team.members.map(member => ({
        handle: member.handle,
        team: team.color,
      }))
    )
    const matchStart = new Date(match.startTime);
    const claims = await checkSolvesLogic(problems, players)
    const newSolves: Array<{
      handle: string;
      team: string;
      contestId: number;
      index: string;
      timestamp: Date;
      matchId: string;
      score?: number | null;
    }> = []

    for (const [key, teamColor] of Object.entries(claims)) {
      const [contestIdStr, index] = key.split('-')
      const contestId = Number(contestIdStr)

      if (!match.solveLog.some(log => log.contestId === contestId && log.index === index)) {
        newSolves.push({
          handle: '',
          team: teamColor,
          contestId,
          index,
          timestamp: new Date(),
          matchId: match.id,
        })
      }
      if (newSolves.length === 0) {
        const updatedMatch = await prisma.match.findUnique({
          where: { id: matchId },
          include: {
            problems: { where: { active: true }, orderBy: { position: 'asc' } },
            teams: { include: { members: true } },
            solveLog: {include: {problem: true}},
          },
        });
        return res.status(200).json({ updated: false, match: updatedMatch });
      }
      for (const s of newSolves) {
        const { contestId, index, team } = s;

        const solvedRow = await prisma.problem.findFirst({
          where: { contestId, index, matchId, active: true },
        });

        const oldProblem = solvedRow ?? await prisma.problem.findUnique({
          where: { contestId_index_matchId: { contestId, index, matchId } },
        });
        await prisma.solveLog.create({
          data: {
            handle: '',
            team,
            contestId,
            index,
            timestamp: new Date(),
            matchId,
          },
        });
        if (match.mode === 'replace' && oldProblem) {
          const increment = match.replaceIncrement ?? 100;
          const newRatingTarget = Math.min(3500, (oldProblem.rating ?? 0) + increment);
          const allHandles = match.teams.flatMap((team) => team.members).flatMap((p) => p.handle);
          const replacementCandidate = await fetchReplacementProblem(
            problems.map(p => String(p.contestId) + p.index), // optional excludes
            newRatingTarget, // try to bias to the desired rating
            newRatingTarget,
            allHandles,
          );
          await prisma.$transaction(async (tx) => {
            await tx.problem.update({
              where: { contestId_index_matchId: { contestId: oldProblem.contestId, index: oldProblem.index, matchId } },
              data: { active: false },
            });

            if (replacementCandidate) {
              await tx.problem.create({
                data: {
                  contestId: replacementCandidate.contestId ?? 0,
                  index: replacementCandidate.index ?? String(Date.now()),
                  matchId,
                  rating: replacementCandidate?.rating ?? newRatingTarget,
                  name: replacementCandidate.name ?? `Problem ${replacementCandidate.index}`,
                  position: oldProblem.position,
                  active: true,
                },
              });
            } else {
              await tx.problem.create({
                data: {
                  contestId: 0,
                  index: String(Date.now()),
                  matchId,
                  rating: newRatingTarget,
                  name: `Replacement (${newRatingTarget})`,
                  position: oldProblem.position,
                  active: true,
                },
              });
            }
          });
        }
      }
    }
    const updatedMatch = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        problems: {where: {active: true}, orderBy: {position: 'asc'}},
        teams: { include: { members: true } },
        solveLog: {include: {problem: true}},
      },
    });
    return res.status(200).json({ updated: true, match: updatedMatch });
  } catch (err) {
    console.error('Error in poll-submissions:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

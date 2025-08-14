import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/app/lib/prisma';

export async function getServerMatch(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: {
      problems: {where: {active: true}, orderBy: {position: 'asc'}},
      solveLog: {
        include: {
          problem: true
        }
      },
      teams: true,
    }
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { matchId } = req.query;
  if (!matchId || typeof matchId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid matchId' });
  }

  const match = await getServerMatch(matchId);
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  return res.status(200).json({ match });
}

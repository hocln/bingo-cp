// pages/api/checkSolves.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { checkSolvesLogic, Problem, Player } from './checkSolvesLogic'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { problems, players } = req.body as {
    problems: Problem[]
    players: Player[]
  }

  try {
    const claims = await checkSolvesLogic(problems, players)
    return res.status(200).json({ claims })
  } catch (err) {
    console.error('Error in checkSolves API:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

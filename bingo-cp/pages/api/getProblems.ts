import type { NextApiRequest, NextApiResponse } from 'next'

type Problem = {
  contestId: number
  index: string
  name: string
  rating?: number
  tags: string[]
}

type Submission = {
  problem: Problem
  verdict: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }
  const {
    minRating = 800,
    maxRating = 3500,
    userHandles = [],
    count = 25,
    exclude = [],
  } = req.body

  try {
    const response = await fetch('https://codeforces.com/api/problemset.problems')
    const data = await response.json()
    if (data.status !== 'OK') {
      return res.status(500).json({ error: 'Failed to fetch problems from Codeforces.' })
    }

    let problems: Problem[] = data.result.problems

    problems = problems.filter(
      (p) =>
        !p.tags.includes('*special') &&
        p.rating &&
        p.rating >= minRating &&
        p.rating <= maxRating &&
        !exclude.includes(String(p.contestId) + p.index)
    )

    const solvedSet = new Set<string>()

    for (const handle of userHandles) {
      const submissionsRes = await fetch(
        `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`
      )
      const submissionsData = await submissionsRes.json()

      if (submissionsData.status !== 'OK') continue

      const submissions: Submission[] = submissionsData.result

      for (const sub of submissions) {
        if (sub.verdict === 'OK') {
          solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`)
        }
      }
    }

    const unsolved = problems.filter(
      (p) => !solvedSet.has(`${p.contestId}-${p.index}`) && !exclude.includes(`${p.contestId}-${p.index}`)
    )
    let idx = 0;
    if(unsolved.length < count) {
      while(unsolved.length < count) {
        unsolved.push(problems[idx]);
        idx += 1;
      }
    }
    const shuffled = unsolved.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count)
    return res.status(200).json({ problems: selected })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

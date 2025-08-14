// src/lib/checkSolvesLogic.ts

export type Problem = {
  contestId: number
  index: string
}

export type Player = {
  handle: string
  team: string
}

export async function checkSolvesLogic(problems: Problem[], players: Player[]) {
  const problemKey = (p: Problem) => `${p.contestId}-${p.index}`
  const trackedProblems = new Set(problems.map(problemKey))
  const claims: Record<string, { team: string; time: number; id: number }> = {}
  for (const player of players) {
    try {
      const res = await fetch(`https://codeforces.com/api/user.status?handle=${player.handle}&from=1&count=10`)
      const data = await res.json()
      if (data.status !== 'OK') continue
      const submissions = data.result as Array<{
        id: number,
        creationTimeSeconds: number,
        problem: { contestId: number; index: string },
        verdict: string
      }>

      for (const sub of submissions) {
        if (sub.verdict !== 'OK') continue
        const key = `${sub.problem.contestId}-${sub.problem.index}`
        if (!trackedProblems.has(key)) continue
        const existing = claims[key]
        if (
          !existing ||
          sub.id < existing.id
        ) {
          claims[key] = {
            team: player.team,
            time: sub.creationTimeSeconds,
            id: sub.id,
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching for ${player.handle}`, err)
    }
  }
  const result: Record<string, string> = {}
  for (const [key, claim] of Object.entries(claims)) {
    result[key] = claim.team
  }
  return result
}

// GET /api/solve-check?handle=your_handle&contestId=1843&index=A

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const handle = searchParams.get('handle')
  const contestId = searchParams.get('contestId')
  const index = searchParams.get('index')

  if (!handle || !contestId || !index) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`)
    const data = await res.json()

    if (data.status !== 'OK') {
      return NextResponse.json({ error: 'Codeforces API error' }, { status: 500 })
    }

    const submissions = data.result
    const solved = submissions.find(
      (s: any) =>
        s.verdict === 'OK' &&
        s.problem.contestId == contestId &&
        s.problem.index == index
    )

    if (solved) {
      return NextResponse.json({
        solved: true,
        submissionId: solved.id,
        timeSeconds: solved.creationTimeSeconds,
      })
    } else {
      return NextResponse.json({ solved: false })
    }
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

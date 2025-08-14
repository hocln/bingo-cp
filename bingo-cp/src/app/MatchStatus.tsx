// 'use client'

// import { useEffect, useState } from 'react'
// import { differenceInSeconds, parseISO } from 'date-fns'
// import type { Match } from './MatchCreationForm'

// function formatTime(seconds: number): string {
//   const h = Math.floor(seconds / 3600)
//   const m = Math.floor((seconds % 3600) / 60)
//   const s = seconds % 60
//   return [h, m, s].map(unit => String(unit).padStart(2, '0')).join(':')
// }

// export function MatchStatus({ match }: { match: Match | null }) {
//   const [now, setNow] = useState(new Date())

//   useEffect(() => {
//     const interval = setInterval(() => setNow(new Date()), 1000)
//     return () => clearInterval(interval)
//   }, [])

//   if (!match) {
//     return null // Or show placeholder
//   }

//   const start = parseISO(match.startTime)
//   const end = new Date(start.getTime() + Math.min(420, match.durationMinutes) * 60000)

//   if (now < start) {
//     const secondsUntilStart = Math.max(0, differenceInSeconds(start, now))
//     return (
//       <div className="text-yellow-500 text-lg font-semibold">
//         Starts in: {formatTime(secondsUntilStart)}
//       </div>
//     )
//   } else if (now >= start && now < end) {
//     const secondsUntilEnd = Math.max(0, differenceInSeconds(end, now))
//     return (
//       <div className="text-green-500 text-lg font-semibold">
//         Ends in: {formatTime(secondsUntilEnd)}
//       </div>
//     )
//   } else {
//     return (
//       <div className="text-red-500 text-lg font-semibold">
//         Match Ended
//       </div>
//     )
//   }
// }

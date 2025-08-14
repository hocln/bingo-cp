// lib/matchTimeUtils.ts

export type Match = {
  id: string;
  name: string;
  startTime: string; // ISO string, e.g., "2025-08-05T20:00:00Z"
  durationMinutes: number;
};

export function getMatchState(match: Match): "upcoming" | "active" | "finished" {
  const now = new Date();
  const start = new Date(match.startTime);
  const end = new Date(start.getTime() + match.durationMinutes * 60 * 1000);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "active";
  return "finished";
}

export function getRemainingTime(match: Match): string | null {
  const now = new Date();
  const start = new Date(match.startTime);
  const end = new Date(start.getTime() + match.durationMinutes * 60 * 1000);

  if (now < start) {
    const ms = start.getTime() - now.getTime();
    return `Starts in: ${formatMs(ms)}`;
  } else if (now >= start && now <= end) {
    const ms = end.getTime() - now.getTime();
    return `Time left: ${formatMs(ms)}`;
  } else {
    return null;
  }
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

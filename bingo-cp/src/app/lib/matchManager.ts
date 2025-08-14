// src/app/lib/matchManager.ts

import type { Match, Team, Problem } from "../lib/types"; // Adjust path if needed

const matches: Record<string, Match> = {};

function createMatch(id: string, grid: Problem[][], teams: Team[]) {
  matches[id] = {
    id,
    grid,
    teams,
    claimed: [], // assuming this holds info about claimed squares
    solveLog: [], // optional: store who solved what
  };
}

function getMatch(id: string): Match | undefined {
  return matches[id];
}

function getAll(): Match[] {
  return Object.values(matches);
}

function claimSquare(
  matchId: string,
  handle: string,
  team: string,
  problem: Problem,
  submissionId: number,
  time: number
): boolean {
  const match = matches[matchId];
  if (!match) return false;

  // Find the cell and mark it claimed — naive implementation
  for (let i = 0; i < match.grid.length; i++) {
    for (let j = 0; j < match.grid[i].length; j++) {
      const cell = match.grid[i][j];
      if (cell.contestId === problem.contestId && cell.index === problem.index) {
        // Check if already claimed
        const alreadyClaimed = match.claimed.some(
          (c) => c.row === i && c.col === j
        );
        if (!alreadyClaimed) {
          match.claimed.push({
            row: i,
            col: j,
            handle,
            team,
            problem,
            submissionId,
            time,
          });
          return true;
        }
      }
    }
  }

  return false;
}

export default {
  createMatch,
  getMatch,
  getAll,
  claimSquare,
};

// src/types.ts

export type Problem = {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  acitve: boolean;
};

export type Team = {
  name: string;
  color: string;
  members: string[]; // handles
};

export type ClaimedSquare = {
  row: number;
  col: number;
  handle: string;
  team: string;
  problem: Problem;
  submissionId: number;
  time: number;
};

type solveLog = {
  id: number;
  handle: string;
  team: string;
  contestId: number;
  index: string;
  timestamp: Date;
  score: number;
  match: Match;
  matchId: string;
  problem: Problem;
}

export type Match = {
  id: string;
  grid: Problem[][];
  teams: Team[];
  claimed: ClaimedSquare[];
  solveLog: solveLog[]; // optional for tracking solves
};


// types.ts

export type SerializedMatch = {
  id: string;
  name: string;
  mode: string;
  startTime: Date;
  duration: number;
  problems: Problem[][];
  teams: Team[];
  solveLog?: ClaimedSquare[];
};

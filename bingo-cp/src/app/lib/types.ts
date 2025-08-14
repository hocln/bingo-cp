// src/types.ts

export type Problem = {
  contestId: number;
  index: string;
  name: string;
  rating: number;
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

export type Match = {
  id: string;
  grid: Problem[][];
  teams: Team[];
  claimed: ClaimedSquare[];
  solveLog: any[]; // optional for tracking solves
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

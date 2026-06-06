/**
 * Shared Type Definitions for Cricket Professional Portal
 */

export interface BatterInnings {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

export interface BowlerInnings {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface TeamMatchState {
  name: string;
  short: string;
  logo: string;
  score: string; // e.g., "164/4"
  runs: number;
  wickets: number;
  overs: number;
  balls: number; // current balls in active over (0-5)
  batsmen: BatterInnings[];
  bowlers: BowlerInnings[];
}

export interface CommentaryItem {
  id: string;
  over: string; // e.g., "14.2"
  event: "WICKET" | "SIX" | "FOUR" | "RUN" | "WIDE" | "NO_BALL" | "DOT";
  scoreText: string;
  text: string;
}

export interface Match {
  id: string;
  title: string;
  status: "LIVE" | "UPCOMING" | "COMPLETED";
  venue: string;
  format: "T20" | "ODI" | "TEST";
  dateTime: string;
  teamA: TeamMatchState;
  teamB: TeamMatchState;
  currentInnings: "A" | "B";
  recentDeliveries: string[]; // e.g. ["1", "4", "W", "0", "6", "1wd"]
  target: number; // Target to win if chasing
  summaryText: string; // e.g., "India needs 14 runs in 6 balls" or "Australia won by 8 wickets"
  commentary: CommentaryItem[];
}

export type PlayerRole = "BAT" | "BOWL" | "AR" | "WK";

export interface Player {
  id: string;
  name: string;
  team: string;
  role: PlayerRole;
  credits: number; // Fantasy cost (e.g. 8.5 to 11)
  avgScore: number; // Average fantasy points
  stats: {
    matches: number;
    runs?: number;
    strikeRate?: number;
    wickets?: number;
    economy?: number;
    catches?: number;
  };
  imageUrl: string;
}

export interface FantasySquad {
  players: Player[];
  captainId: string | null;
  viceCaptainId: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: "Editorial" | "Analysis" | "Match Report" | "Interview";
  readTime: string;
  imageUrl: string;
}

export interface StandingTeam {
  position: number;
  name: string;
  matches: number;
  won: number;
  lost: number;
  points: number;
  nrr: string;
  recent: ("W" | "L")[];
}

export interface ICCRankingItem {
  rank: number;
  player: string;
  team: string;
  rating: number;
}

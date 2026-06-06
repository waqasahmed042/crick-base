import { Match, Player, NewsArticle, StandingTeam, ICCRankingItem } from "../types";

// 1. MATCHES DATA
export const INITIAL_MATCH_STATE: Match = {
  id: "m-1",
  title: "India vs Australia, T20 World Cup - Super 8",
  status: "LIVE",
  venue: "Kensington Oval, Bridgetown, Barbados",
  format: "T20",
  dateTime: "Live Now",
  currentInnings: "B", // Team B (India) is chasing Team A (Australia)'s score
  target: 184,
  summaryText: "India needs 14 runs off the final 6 balls!",
  recentDeliveries: ["4", "1", "W", "2", "6", "1"], // previous over deliveries
  teamA: {
    name: "Australia",
    short: "AUS",
    logo: "🦘",
    score: "183/6",
    runs: 183,
    wickets: 6,
    overs: 20,
    balls: 0,
    batsmen: [
      { name: "Travis Head", runs: 74, balls: 43, fours: 8, sixes: 3, strikeRate: 172.09 },
      { name: "Mitchell Marsh", runs: 35, balls: 24, fours: 3, sixes: 1, strikeRate: 145.83 },
      { name: "Glenn Maxwell", runs: 28, balls: 15, fours: 2, sixes: 2, strikeRate: 186.67 },
      { name: "Marcus Stoinis", runs: 12, balls: 8, fours: 1, sixes: 0, strikeRate: 150.0 },
      { name: "Tim David", runs: 15, balls: 11, fours: 1, sixes: 1, strikeRate: 136.36 },
      { name: "Matthew Wade", runs: 8, balls: 6, fours: 1, sixes: 0, strikeRate: 133.33 }
    ],
    bowlers: [
      { name: "Jasprit Bumrah", overs: 4, maidens: 0, runs: 24, wickets: 3, economy: 6.0 },
      { name: "Arshdeep Singh", overs: 4, maidens: 0, runs: 42, wickets: 1, economy: 10.5 },
      { name: "Kuldeep Yadav", overs: 4, maidens: 0, runs: 31, wickets: 1, economy: 7.75 },
      { name: "Hardik Pandya", overs: 4, maidens: 0, runs: 39, wickets: 1, economy: 9.75 },
      { name: "Ravindra Jadeja", overs: 4, maidens: 0, runs: 43, wickets: 0, economy: 10.75 }
    ]
  },
  teamB: {
    name: "India",
    short: "IND",
    logo: "🏏",
    score: "170/5",
    runs: 170,
    wickets: 5,
    overs: 19,
    balls: 0,
    batsmen: [
      { name: "Rohit Sharma", runs: 62, balls: 38, fours: 6, sixes: 3, strikeRate: 163.16 },
      { name: "Virat Kohli", runs: 48, balls: 31, fours: 4, sixes: 2, strikeRate: 154.84 },
      { name: "Suryakumar Yadav", runs: 29, balls: 16, fours: 3, sixes: 1, strikeRate: 181.25 },
      { name: "Rishabh Pant", runs: 11, balls: 9, fours: 1, sixes: 0, strikeRate: 122.22 },
      { name: "Hardik Pandya", runs: 12, balls: 14, fours: 0, sixes: 1, strikeRate: 85.71 },
      { name: "Ravindra Jadeja", runs: 4, balls: 2, fours: 0, sixes: 0, strikeRate: 200.0 }
    ],
    bowlers: [
      { name: "Mitchell Starc", overs: 4, maidens: 0, runs: 41, wickets: 1, economy: 10.25 },
      { name: "Josh Hazlewood", overs: 4, maidens: 1, runs: 28, wickets: 1, economy: 7.0 },
      { name: "Pat Cummins", overs: 3, maidens: 0, runs: 34, wickets: 1, economy: 11.33 },
      { name: "Adam Zampa", overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.0 },
      { name: "Marcus Stoinis", overs: 4, maidens: 0, runs: 35, wickets: 0, economy: 8.75 } // Pat Cummins has 1 over left to bowl the 20th!
    ]
  },
  commentary: [
    { id: "c1", over: "19.0", event: "RUN", scoreText: "170/5", text: "Marcus Stoinis to Ravindra Jadeja, 1 run. Guided down to third man. A single retains the strike. What a tense finish we have on our hands!" },
    { id: "c2", over: "18.5", event: "SIX", scoreText: "169/5", text: "Marcus Stoinis to Hardik Pandya, SIX RUNS! Massively struck down the ground! Stoinis misses the yorker and Pandya lifts it clean over long-on. India alive!" },
    { id: "c3", over: "18.4", event: "DOT", scoreText: "163/5", text: "Marcus Stoinis to Hardik Pandya, no run. Nicely hidden outside off-stump, swing and a miss." },
    { id: "c4", over: "18.3", event: "RUN", scoreText: "163/5", text: "Marcus Stoinis to Ravindra Jadeja, 1 run. Slower delivery, nudged towards mid-wicket for a quick rotation." },
    { id: "c5", over: "18.2", event: "WICKET", scoreText: "162/5", text: "Marcus Stoinis to Suryakumar Yadav, OUT! Caught by Mitchell Marsh! Yadav walks across his stumps to scoop, gets a leading edge high inside the circle. Marsh runs back from mid-off and takes a brilliant reverse-cup catch. Huge wicket!" },
    { id: "c6", over: "18.1", event: "FOUR", scoreText: "162/4", text: "Marcus Stoinis to Suryakumar Yadav, FOUR RUNS! Inside out over cover! Absolutely glorious wrist-work." }
  ]
};

export const OTHER_MATCHES: Match[] = [
  {
    id: "m-2",
    title: "England vs Pakistan, ODI Series - 1st Match",
    status: "UPCOMING",
    venue: "Lord's, London",
    format: "ODI",
    dateTime: "Tomorrow, 10:00 AM UTC",
    currentInnings: "A",
    target: 0,
    summaryText: "Starts tomorrow - Match pitches are highly suited for fast swing bowling.",
    recentDeliveries: [],
    teamA: {
      name: "England",
      short: "ENG",
      logo: "🦁",
      score: "0/0",
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      batsmen: [],
      bowlers: []
    },
    teamB: {
      name: "Pakistan",
      short: "PAK",
      logo: "🌙",
      score: "0/0",
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      batsmen: [],
      bowlers: []
    },
    commentary: [
      { id: "c-u1", over: "0.0", event: "DOT", scoreText: "Upcoming Match", text: "Pristine Lord's wicket. Curators indicate moderate green grass. Expected overhead clouds, ideal for swing bowlers like James Anderson or Shaheen Afridi." }
    ]
  },
  {
    id: "m-3",
    title: "South Africa vs New Zealand, Test Series - 2nd Test",
    status: "COMPLETED",
    venue: "Newlands, Cape Town",
    format: "TEST",
    dateTime: "Completed 2 days ago",
    currentInnings: "B",
    target: 242,
    summaryText: "New Zealand won by 4 wickets",
    recentDeliveries: [],
    teamA: {
      name: "South Africa",
      short: "RSA",
      logo: "🇿🇦",
      score: "311 & 214",
      runs: 525,
      wickets: 20,
      overs: 165,
      balls: 0,
      batsmen: [
        { name: "Aiden Markram", runs: 112, balls: 198, fours: 14, sixes: 0, strikeRate: 56.56 },
        { name: "Temba Bavuma", runs: 65, balls: 120, fours: 7, sixes: 0, strikeRate: 54.16 }
      ],
      bowlers: [
        { name: "Kagiso Rabada", overs: 32, maidens: 8, runs: 95, wickets: 6, economy: 2.96 },
        { name: "Anrich Nortje", overs: 28, maidens: 4, runs: 110, wickets: 3, economy: 3.92 }
      ]
    },
    teamB: {
      name: "New Zealand",
      short: "NZ",
      logo: "🇳🇿",
      score: "284 & 245/6",
      runs: 529,
      wickets: 16,
      overs: 154.2,
      balls: 0,
      batsmen: [
        { name: "Kane Williamson", runs: 124, balls: 245, fours: 11, sixes: 1, strikeRate: 50.61 },
        { name: "Daryl Mitchell", runs: 68, balls: 112, fours: 8, sixes: 1, strikeRate: 60.71 }
      ],
      bowlers: [
        { name: "Tim Southee", overs: 34, maidens: 10, runs: 85, wickets: 5, economy: 2.5 },
        { name: "Matt Henry", overs: 29, maidens: 6, runs: 78, wickets: 4, economy: 2.68 }
      ]
    },
    commentary: [
      { id: "c-c1", over: "78.2", event: "FOUR", scoreText: "245/6", text: "Mitchell Santner pulls it fine through back leg for four! That splits the field and signals victory for New Zealand. An absolutely gritty test match finishes in grand style with Kane Williamson named Player of the Match." }
    ]
  }
];


// 2. FANTASY PLAYERS POOL
export const PLAYERS_POOL: Player[] = [
  // Wicket Keepers (WK) - Must have exactly 1 in squad (or 1-2 based on rules)
  {
    id: "p-1",
    name: "Rishabh Pant",
    team: "IND",
    role: "WK",
    credits: 9.5,
    avgScore: 68,
    stats: { matches: 38, runs: 1105, strikeRate: 144.5, catches: 22 },
    imageUrl: "https://img.icons8.com/color/120/cricket-helmet.png"
  },
  {
    id: "p-2",
    name: "Mohammad Rizwan",
    team: "PAK",
    role: "WK",
    credits: 9.0,
    avgScore: 54,
    stats: { matches: 45, runs: 1320, strikeRate: 128.2, catches: 18 },
    imageUrl: "https://img.icons8.com/color/120/cricket-helmet.png"
  },
  {
    id: "p-3",
    name: "Jos Buttler",
    team: "ENG",
    role: "WK",
    credits: 10.5,
    avgScore: 72,
    stats: { matches: 58, runs: 1740, strikeRate: 156.4, catches: 28 },
    imageUrl: "https://img.icons8.com/color/120/cricket-helmet.png"
  },

  // Batsmen (BAT)
  {
    id: "p-4",
    name: "Virat Kohli",
    team: "IND",
    role: "BAT",
    credits: 11.0,
    avgScore: 84,
    stats: { matches: 115, runs: 4008, strikeRate: 137.9, catches: 42 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },
  {
    id: "p-5",
    name: "Rohit Sharma",
    team: "IND",
    role: "BAT",
    credits: 10.0,
    avgScore: 65,
    stats: { matches: 148, runs: 3853, strikeRate: 139.2, catches: 48 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },
  {
    id: "p-6",
    name: "Travis Head",
    team: "AUS",
    role: "BAT",
    credits: 10.0,
    avgScore: 78,
    stats: { matches: 34, runs: 980, strikeRate: 168.3, catches: 11 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },
  {
    id: "p-7",
    name: "Babar Azam",
    team: "PAK",
    role: "BAT",
    credits: 10.5,
    avgScore: 62,
    stats: { matches: 104, runs: 3485, strikeRate: 129.5, catches: 29 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },
  {
    id: "p-8",
    name: "Harry Brook",
    team: "ENG",
    role: "BAT",
    credits: 9.0,
    avgScore: 52,
    stats: { matches: 27, runs: 645, strikeRate: 148.9, catches: 12 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },
  {
    id: "p-9",
    name: "Kane Williamson",
    team: "NZ",
    role: "BAT",
    credits: 9.5,
    avgScore: 59,
    stats: { matches: 87, runs: 2464, strikeRate: 122.8, catches: 34 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },
  {
    id: "p-10",
    name: "Heinrich Klaasen",
    team: "RSA",
    role: "BAT",
    credits: 9.5,
    avgScore: 70,
    stats: { matches: 42, runs: 910, strikeRate: 171.2, catches: 15 },
    imageUrl: "https://img.icons8.com/color/120/cricket-player.png"
  },

  // All-Rounders (AR)
  {
    id: "p-11",
    name: "Hardik Pandya",
    team: "IND",
    role: "AR",
    credits: 10.0,
    avgScore: 71,
    stats: { matches: 85, runs: 1240, strikeRate: 139.4, wickets: 69, economy: 8.12 },
    imageUrl: "https://img.icons8.com/color/120/cricket.png"
  },
  {
    id: "p-12",
    name: "Glenn Maxwell",
    team: "AUS",
    role: "AR",
    credits: 10.0,
    avgScore: 75,
    stats: { matches: 98, runs: 2160, strikeRate: 153.1, wickets: 40, economy: 7.82 },
    imageUrl: "https://img.icons8.com/color/120/cricket.png"
  },
  {
    id: "p-13",
    name: "Liam Livingstone",
    team: "ENG",
    role: "AR",
    credits: 9.0,
    avgScore: 56,
    stats: { matches: 38, runs: 680, strikeRate: 147.2, wickets: 18, economy: 7.95 },
    imageUrl: "https://img.icons8.com/color/120/cricket.png"
  },
  {
    id: "p-14",
    name: "Mitchell Marsh",
    team: "AUS",
    role: "AR",
    credits: 9.5,
    avgScore: 64,
    stats: { matches: 54, runs: 1245, strikeRate: 134.8, wickets: 15, economy: 8.5 },
    imageUrl: "https://img.icons8.com/color/120/cricket.png"
  },
  {
    id: "p-15",
    name: "Aiden Markram",
    team: "RSA",
    role: "AR",
    credits: 9.0,
    avgScore: 58,
    stats: { matches: 39, runs: 955, strikeRate: 142.3, wickets: 10, economy: 7.2 },
    imageUrl: "https://img.icons8.com/color/120/cricket.png"
  },

  // Bowlers (BOWL)
  {
    id: "p-16",
    name: "Jasprit Bumrah",
    team: "IND",
    role: "BOWL",
    credits: 11.0,
    avgScore: 88,
    stats: { matches: 62, wickets: 84, economy: 6.25 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-17",
    name: "Shaheen Afridi",
    team: "PAK",
    role: "BOWL",
    credits: 10.0,
    avgScore: 74,
    stats: { matches: 52, wickets: 73, economy: 7.42 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-18",
    name: "Jofra Archer",
    team: "ENG",
    role: "BOWL",
    credits: 9.0,
    avgScore: 61,
    stats: { matches: 25, wickets: 34, economy: 7.15 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-19",
    name: "Pat Cummins",
    team: "AUS",
    role: "BOWL",
    credits: 10.0,
    avgScore: 68,
    stats: { matches: 50, wickets: 55, economy: 7.6 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-20",
    name: "Kagiso Rabada",
    team: "RSA",
    role: "BOWL",
    credits: 9.5,
    avgScore: 69,
    stats: { matches: 56, wickets: 65, economy: 7.85 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-21",
    name: "Rashid Khan",
    team: "AFG",
    role: "BOWL",
    credits: 10.5,
    avgScore: 82,
    stats: { matches: 82, wickets: 122, economy: 6.18 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-22",
    name: "Kuldeep Yadav",
    team: "IND",
    role: "BOWL",
    credits: 9.0,
    avgScore: 63,
    stats: { matches: 35, wickets: 48, economy: 6.74 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-23",
    name: "Trent Boult",
    team: "NZ",
    role: "BOWL",
    credits: 9.5,
    avgScore: 66,
    stats: { matches: 55, wickets: 74, economy: 7.25 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  },
  {
    id: "p-24",
    name: "Naseem Shah",
    team: "PAK",
    role: "BOWL",
    credits: 8.5,
    avgScore: 55,
    stats: { matches: 28, wickets: 32, economy: 7.55 },
    imageUrl: "https://img.icons8.com/color/120/cricket-stump.png"
  }
];

// 3. EDITORIAL ARTICLES
export const EDITORIAL_ARTICLES: NewsArticle[] = [
  {
    id: "art-1",
    title: "The Mechanics of Modern Strike-Rates in T20 Powerplays",
    summary: "How ultra-aggressive hitting in the first 6 overs transitioned from a gamble to a baseline structural requirement.",
    content: `In early T20 cricket, the powerplay was parsed identically to fifty-over cricket: keep wickets intact, locate gaps, and construct a platform for a 160-runs assault. Statistically, this caution has been dismantled.\n\nToday, advanced analytical modeling proves that wickets lost in the first six overs have a significantly lower correlation with match defeat than scoring dot balls. If a team registers an average of 42/1 in the powerplay, their probability of clearing a 200-run ceiling remains under 25%. However, registering 68/3 increases that expectation to nearly 65%.\n\nAnalysts refer to this math as 'Inherent Volatility Cushion'. Standard T20 strategy now employs explosive designated hitmen (like Travis Head or Jos Buttler) whose instruction is absolute: clear the inner circle margins on every delivery. A quick strike of 25 off 9 balls is more valuable to total scoreboard velocity than a composed 40 off 32.`,
    date: "June 05, 2026",
    author: "Harsha Bhogle (Senior Analyst)",
    category: "Analysis",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1540747737956-378724044282?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "art-2",
    title: "Swing, Seam, and Air Friction: Decoding the New Ball at Lord's",
    summary: "A deep fluid-dynamics dive into how cloud cover triggers late aero-swing and why speed isn't the only weapon.",
    content: `Bowlers Shaheen Afridi and Jasprit Bumrah do not just possess extreme muscle density; they are masters of aerodynamical physics. Swing bowling is governed by boundary-layer transition and asymmetric air vortex friction.\n\nWhen a cricket ball is brand new, the seam splits split-stream air flow. If one side of the ball is polished, flow transitions from laminar to turbulent at different points on opposing hemispheres. This pressure imbalance generates the transverse lateral force we recognize as 'swing'.\n\nWhy does cloud cover matter? Standard locker-room wisdom states 'humid air is heavier'. Scientifically, humid air is lighter because water molecules (H2O) are less dense than nitrogen and oxygen. This alteration in atmospheric density changes the surface viscosity coefficient of the air. When matched with moisture, condensation layers drag on code seam grooves, maintaining laminarity longer on the smooth side and generating that sudden late deviation that leaves top-order batsmen completely stranded.`,
    date: "June 03, 2026",
    author: "Dr. Naseer Hamid (Aero-Physics Lab)",
    category: "Editorial",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "art-3",
    title: "Exclusive: Williamson Reflects on Cape Town's Pitch Architecture",
    summary: "The Kiwi legend discusses the physical stamina, mental focus patience, and footwork adaptations required on variable-bounce wickets.",
    content: `Following New Zealand's dramatic 4-wicket triumph in Cape Town, Kane Williamson sat down to reflect on navigating Newlands' variable bounce.\n\n'On cracks like Cape Town, you cannot commit to the pitch of the delivery early,' Williamson explained. 'If you lunging forward blindly, the ball that runs along the ground gets you LBW, or the one that leaps catches your glove. Adapting meant transferring weight further back, tracking wrist angles, and ensuring the ball met our blade right under our eyelids.'\n\nHe discusses the battle against South Africa's express pace attack. 'When Rabada is steaming in at 145 kph, your reaction margins are minimal. It becomes a game of extreme visual tracking. You aren't playing the bowler; you are purely playing the seam orientation of the ball.'`,
    date: "June 01, 2026",
    author: "Nasser Hussain (Match Correspondent)",
    category: "Interview",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f866ad?w=500&auto=format&fit=crop&q=60"
  }
];


// 4. TOURNAMENT STANDINGS & ICC RANKINGS
export const TOURNAMENT_STANDINGS: StandingTeam[] = [
  { position: 1, name: "India", matches: 5, won: 4, lost: 1, points: 8, nrr: "+1.354", recent: ["W", "W", "L", "W", "W"] },
  { position: 2, name: "Australia", matches: 5, won: 4, lost: 1, points: 8, nrr: "+1.102", recent: ["W", "L", "W", "W", "W"] },
  { position: 3, name: "South Africa", matches: 5, won: 3, lost: 2, points: 6, nrr: "+0.452", recent: ["L", "W", "W", "L", "W"] },
  { position: 4, name: "England", matches: 5, won: 2, lost: 3, points: 4, nrr: "-0.122", recent: ["W", "L", "L", "W", "L"] },
  { position: 5, name: "Pakistan", matches: 5, won: 2, lost: 3, points: 4, nrr: "-0.450", recent: ["L", "W", "L", "L", "W"] },
  { position: 6, name: "New Zealand", matches: 5, won: 1, lost: 4, points: 2, nrr: "-0.812", recent: ["L", "L", "W", "L", "L"] },
  { position: 7, name: "Afghanistan", matches: 5, won: 1, lost: 4, points: 2, nrr: "-1.115", recent: ["W", "L", "L", "L", "L"] }
];

export const ICC_RANKINGS_BAT: ICCRankingItem[] = [
  { rank: 1, player: "Babar Azam", team: "PAK", rating: 824 },
  { rank: 2, player: "Suryakumar Yadav", team: "IND", rating: 808 },
  { rank: 3, player: "Travis Head", team: "AUS", rating: 795 },
  { rank: 4, player: "Jos Buttler", team: "ENG", rating: 764 },
  { rank: 5, player: "Aiden Markram", team: "RSA", rating: 712 }
];

export const ICC_RANKINGS_BOWL: ICCRankingItem[] = [
  { rank: 1, player: "Rashid Khan", team: "AFG", rating: 761 },
  { rank: 2, player: "Jasprit Bumrah", team: "IND", rating: 745 },
  { rank: 3, player: "Shaheen Afridi", team: "PAK", rating: 728 },
  { rank: 4, player: "Josh Hazlewood", team: "AUS", rating: 702 },
  { rank: 5, player: "Anrich Nortje", team: "RSA", rating: 685 }
];

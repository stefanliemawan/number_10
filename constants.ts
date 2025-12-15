
import { Stats, Minister, Day } from './types';

export const INITIAL_STATS: Stats = {
  approval: 75,
  partyUnity: 90,
  budget: 250,
  influence: 30,
  mediaPerception: 45,
  nationalSecurity: 70,
  week: 1,
  day: Day.MONDAY,
  actionsLeft: 3
};

export const INITIAL_MINISTERS: Minister[] = [
  { 
    id: 'm1', name: 'Julian Thorne', role: 'Career Politician', skill: 85, loyalty: 40, happiness: 60, ambition: 90, 
    goal: 'To be Prime Minister', personality: 'Aggressive', bio: 'A shark in a Savile Row suit.', 
    portrait: 'https://picsum.photos/id/1/200/300' 
  },
  { 
    id: 'm2', name: 'Sarah Jenkins', role: 'Economist', skill: 95, loyalty: 70, happiness: 50, ambition: 40, 
    goal: 'Balanced Books', personality: 'Stoic', bio: 'Indispensable for the budget.',
    portrait: 'https://picsum.photos/id/2/200/300' 
  },
  { 
    id: 'm3', name: "David Wright", role: 'Old Guard', skill: 60, loyalty: 95, happiness: 80, ambition: 10, 
    goal: 'Maintain Tradition', personality: 'Traditionalist', bio: 'A relic of the 80s.',
    portrait: 'https://picsum.photos/id/3/200/300' 
  },
  { 
    id: 'm4', name: 'Clara Oswald', role: 'Socialite', skill: 75, loyalty: 50, happiness: 90, ambition: 60, 
    goal: 'Social Reform', personality: 'Idealist', bio: 'Smooths over scandals.',
    portrait: 'https://picsum.photos/id/4/200/300' 
  },
  { 
    id: 'm5', name: 'Marcus Black', role: 'Military Int.', skill: 80, loyalty: 85, happiness: 50, ambition: 30, 
    goal: 'Strong Defense', personality: 'Stoic', bio: 'Speaks in clipped sentences.',
    portrait: 'https://picsum.photos/id/5/200/300' 
  },
  { 
    id: 'm6', name: 'Elena Vance', role: 'Union Liaison', skill: 70, loyalty: 60, happiness: 40, ambition: 75, 
    goal: 'Workers Rights', personality: 'Idealist', bio: 'A northern firebrand.',
    portrait: 'https://picsum.photos/id/6/200/300' 
  },
  { 
    id: 'm7', name: 'Sir Humphrey', role: 'Civil Servant', skill: 99, loyalty: 30, happiness: 50, ambition: 50, 
    goal: 'Status Quo', personality: 'Traditionalist', bio: 'Master of obfuscation.',
    portrait: 'https://picsum.photos/id/7/200/300' 
  },
  { 
    id: 'm8', name: 'Victoria Peak', role: 'Investor', skill: 88, loyalty: 40, happiness: 65, ambition: 70, 
    goal: 'Deregulation', personality: 'Greedy', bio: 'Profit is her only language.',
    portrait: 'https://picsum.photos/id/8/200/300' 
  }
];

export const RESPONSE_CARDS = [
  { id: 'r1', label: 'Deflect to Previous Admin', style: 'AGGRESSIVE', impact: 5 },
  { id: 'r2', label: 'Focus on Long-Term Plan', style: 'DEFENSIVE', impact: 7 },
  { id: 'r3', label: 'Quick-Witted Retort', style: 'WITTY', impact: 10 },
  { id: 'r4', label: 'Cite Economic Growth', style: 'STATISTICAL', impact: 8 },
  { id: 'r5', label: 'Apologize and Promise Action', style: 'DEFENSIVE', impact: 4 },
  { id: 'r6', label: 'Mock the Opposition Leader', style: 'AGGRESSIVE', impact: 12 }
];

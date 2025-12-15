
export enum GamePhase {
  DASHBOARD = 'DASHBOARD',
  CABINET = 'CABINET',
  CHARACTERS = 'CHARACTERS',
  MEDIA = 'MEDIA',
  EVENT = 'EVENT',
  PMQ = 'PMQ',
  GAME_OVER = 'GAME_OVER'
}

export enum Day {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export interface Stats {
  approval: number;
  partyUnity: number;
  budget: number; // In Billions £
  influence: number;
  mediaPerception: number; // 0-100
  nationalSecurity: number; // 0-100
  week: number;
  day: Day;
  actionsLeft: number;
}

export interface Minister {
  id: string;
  name: string;
  role: string;
  skill: number;
  loyalty: number;
  happiness: number;
  ambition: number;
  goal: string;
  portrait: string;
  assignedRoleId?: string;
  bio: string;
  isResigned?: boolean;
  personality: 'Aggressive' | 'Stoic' | 'Greedy' | 'Idealist' | 'Traditionalist';
}

export interface DispatchAction {
  id: string;
  type: 'MI5' | 'PROJECT_SIGN' | 'PROJECT_START' | 'PUBLIC_VISIT' | 'FOREIGN' | 'PRESS' | 'MINISTER_SUGGESTION';
  title: string;
  description: string;
  linkedMinisterId?: string;
}

export interface PoliticalEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  options: EventOption[];
}

export interface MinisterHappinessChange {
  ministerName: string;
  happinessDelta: number;
}

export interface EventOption {
  label: string;
  description: string;
  consequences: Partial<Stats> & { ministerHappiness?: MinisterHappinessChange[] };
  flavourText: string;
}

export const ROLES = [
  { id: 'chancellor', label: 'Chancellor of the Exchequer', icon: '💰' },
  { id: 'home_sec', label: 'Home Secretary', icon: '👮' },
  { id: 'foreign_sec', label: 'Foreign Secretary', icon: '🌍' },
  { id: 'energy_min', label: 'Minister for Energy', icon: '⚡' },
  { id: 'health_sec', label: 'Secretary for Health', icon: '🏥' },
  { id: 'mi5_dg', label: 'Director General of MI5', icon: '🕵️' }
];

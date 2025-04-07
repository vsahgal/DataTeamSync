import { nanoid } from 'nanoid';
import { LocalReward } from '@shared/schema';

// Shower constants
export const POINTS_PER_SECOND = 1;
export const MAX_SHOWER_TIME = 300; // 5 minutes
export const OPTIMAL_SHOWER_TIME = 240; // 4 minutes
export const WATER_TOGGLE_INTERVAL = 300; // Water animation toggle interval in ms

// Level system - now based on number of showers rather than points
// Level 1-10: 1 shower per level
// Level 11-20: 2 showers per level
// Level 21+: 3 showers per level
export const LEVELS = [
  // Tier 1: 1 shower per level (levels 1-10)
  { level: 1, name: "Bubble Beginner", pointsNeeded: 0, color: "#4EADEA", showersNeeded: 1 },
  { level: 2, name: "Splash Starter", pointsNeeded: 50, color: "#4EA0EA", showersNeeded: 1 },
  { level: 3, name: "Clean Cadet", pointsNeeded: 120, color: "#4E93EA", showersNeeded: 1 },
  { level: 4, name: "Shower Scout", pointsNeeded: 200, color: "#4E86EA", showersNeeded: 1 },
  { level: 5, name: "Bath Buddy", pointsNeeded: 300, color: "#4E79EA", showersNeeded: 1 },
  { level: 6, name: "Rinse Ranger", pointsNeeded: 450, color: "#4E6CEA", showersNeeded: 1 },
  { level: 7, name: "Washcloth Wizard", pointsNeeded: 600, color: "#4E5FEA", showersNeeded: 1 },
  { level: 8, name: "Soap Superstar", pointsNeeded: 800, color: "#574EEA", showersNeeded: 1 },
  { level: 9, name: "Hygiene Hero", pointsNeeded: 1000, color: "#644EEA", showersNeeded: 1 },
  { level: 10, name: "Shower Champion", pointsNeeded: 1500, color: "#714EEA", showersNeeded: 1 },
  
  // Tier 2: 2 showers per level (levels 11-20)
  { level: 11, name: "Bubble Master", pointsNeeded: 2000, color: "#7E4EEA", showersNeeded: 2 },
  { level: 12, name: "Splash Expert", pointsNeeded: 2500, color: "#8B4EEA", showersNeeded: 2 },
  { level: 13, name: "Clean Commander", pointsNeeded: 3000, color: "#984EEA", showersNeeded: 2 },
  { level: 14, name: "Shower Sergeant", pointsNeeded: 3500, color: "#A54EEA", showersNeeded: 2 },
  { level: 15, name: "Bath Baron", pointsNeeded: 4000, color: "#B24EEA", showersNeeded: 2 },
  { level: 16, name: "Rinse Royalty", pointsNeeded: 4500, color: "#BF4EEA", showersNeeded: 2 },
  { level: 17, name: "Washcloth Warrior", pointsNeeded: 5000, color: "#CC4EEA", showersNeeded: 2 },
  { level: 18, name: "Soap Sovereign", pointsNeeded: 5500, color: "#D94EEA", showersNeeded: 2 },
  { level: 19, name: "Hygiene High Lord", pointsNeeded: 6000, color: "#E64EEA", showersNeeded: 2 },
  { level: 20, name: "Shower Supreme", pointsNeeded: 6500, color: "#EA4EE0", showersNeeded: 2 },
  
  // Tier 3: 3 showers per level (levels 21+)
  { level: 21, name: "Bubble Emperor", pointsNeeded: 7000, color: "#EA4ED3", showersNeeded: 3 },
  { level: 22, name: "Splash Overlord", pointsNeeded: 7500, color: "#EA4EC6", showersNeeded: 3 },
  { level: 23, name: "Clean Conqueror", pointsNeeded: 8000, color: "#EA4EB9", showersNeeded: 3 },
  { level: 24, name: "Shower Sovereign", pointsNeeded: 8500, color: "#EA4EAC", showersNeeded: 3 },
  { level: 25, name: "Bath Deity", pointsNeeded: 9000, color: "#EA4E9F", showersNeeded: 3 }
];

// Initial rewards
export const initialRewards: LocalReward[] = [
  {
    id: 'reward-1',
    name: 'Beginner Bather',
    description: 'Complete 3 showers',
    type: 'character',
    iconName: 'beginner',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-2',
    name: 'Regular Rinser',
    description: 'Complete 7 showers',
    type: 'character',
    iconName: 'regular',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-3',
    name: 'Snorkeler',
    description: 'Earn 300 points total',
    type: 'accessory',
    iconName: 'snorkel',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-4',
    name: 'Water Master',
    description: 'Earn 700 points total',
    type: 'background',
    iconName: 'master',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-5',
    name: 'Consistent Cleaner',
    description: 'Get a 3-day streak',
    type: 'accessory',
    iconName: 'consistent',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-6',
    name: 'Weekly Champion',
    description: 'Get a 7-day streak',
    type: 'background',
    iconName: 'champion',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-7',
    name: 'Bubble Blower',
    description: 'Complete a 5-minute shower',
    type: 'accessory',
    iconName: 'bubbles',
    unlocked: false,
    unlockedAt: null
  },
  {
    id: 'reward-8',
    name: 'Eco Friend',
    description: 'Complete 5 optimal-length showers',
    type: 'character',
    iconName: 'eco',
    unlocked: false,
    unlockedAt: null
  },
];

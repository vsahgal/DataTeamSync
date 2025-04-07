import { nanoid } from 'nanoid';
import { LocalReward } from '@shared/schema';

// Shower constants
export const POINTS_PER_SECOND = 1;
export const MAX_SHOWER_TIME = 300; // 5 minutes
export const OPTIMAL_SHOWER_TIME = 240; // 4 minutes
export const WATER_TOGGLE_INTERVAL = 300; // Water animation toggle interval in ms

// Level system
export const LEVELS = [
  { level: 1, name: "Bubble Beginner", pointsNeeded: 0, color: "#4EADEA" },
  { level: 2, name: "Splash Starter", pointsNeeded: 50, color: "#4EA0EA" },
  { level: 3, name: "Clean Cadet", pointsNeeded: 120, color: "#4E93EA" },
  { level: 4, name: "Shower Scout", pointsNeeded: 200, color: "#4E86EA" },
  { level: 5, name: "Bath Buddy", pointsNeeded: 300, color: "#4E79EA" },
  { level: 6, name: "Rinse Ranger", pointsNeeded: 450, color: "#4E6CEA" },
  { level: 7, name: "Washcloth Wizard", pointsNeeded: 600, color: "#4E5FEA" },
  { level: 8, name: "Soap Superstar", pointsNeeded: 800, color: "#574EEA" },
  { level: 9, name: "Hygiene Hero", pointsNeeded: 1000, color: "#644EEA" },
  { level: 10, name: "Shower Champion", pointsNeeded: 1500, color: "#714EEA" }
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

import { nanoid } from 'nanoid';
import { LocalReward } from '@shared/schema';

// Shower constants
export const POINTS_PER_SECOND = 1;
export const MAX_SHOWER_TIME = 300; // 5 minutes
export const OPTIMAL_SHOWER_TIME = 240; // 4 minutes
export const WATER_TOGGLE_INTERVAL = 300; // Water animation toggle interval in ms

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

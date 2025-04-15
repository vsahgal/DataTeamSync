import { 
  LocalShowerSession, 
  LocalReward, 
  ShowerStats 
} from '@shared/schema';
import { initialRewards, LEVELS } from './constants';
import { CollectedItem, LootItem } from './lootItems';

const STORAGE_KEYS = {
  SESSIONS: 'shower_sessions',
  REWARDS: 'shower_rewards',
  STATS: 'shower_stats',
  COLLECTED_LOOT: 'collected_loot',
  PENDING_LOOT: 'pending_loot',
  CHILD_NAME: 'child_name',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SHOWER_DAYS: 'last_shower_days',
  SHOWER_IN_PROGRESS: 'shower_in_progress' // Track if a shower is happening
};

// Initialize local storage with default values if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(initialRewards));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    // Set a default last shower date that's 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const initialStats: ShowerStats = {
      totalSessions: 1,
      totalPoints: 10,
      longestShower: 120, // 2 minutes
      streakDays: 0,
      lastShowerDate: twoDaysAgo.toISOString(),
      level: 1,
      lastLevelUp: null
    };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialStats));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.COLLECTED_LOOT)) {
    localStorage.setItem(STORAGE_KEYS.COLLECTED_LOOT, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PENDING_LOOT)) {
    localStorage.setItem(STORAGE_KEYS.PENDING_LOOT, JSON.stringify(null));
  }
  
  // Initialize onboarding status if not set
  if (localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === null) {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(false));
  }
};

// Initialize on first import
initializeStorage();

// Shower Sessions
export const getShowerSessions = (): LocalShowerSession[] => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting shower sessions:', error);
    return [];
  }
};

export const saveShowerSession = (session: LocalShowerSession): void => {
  try {
    const sessions = getShowerSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    
    // Check if any rewards should be unlocked
    checkAndUnlockRewards();
  } catch (error) {
    console.error('Error saving shower session:', error);
  }
};

// Rewards
export const getRewards = (): LocalReward[] => {
  try {
    const rewards = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return rewards ? JSON.parse(rewards) : initialRewards;
  } catch (error) {
    console.error('Error getting rewards:', error);
    return initialRewards;
  }
};

export const saveRewards = (rewards: LocalReward[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  } catch (error) {
    console.error('Error saving rewards:', error);
  }
};

// Unlock a reward
export const unlockReward = (rewardId: string): LocalReward | null => {
  try {
    const rewards = getRewards();
    const rewardIndex = rewards.findIndex(r => r.id === rewardId);
    
    if (rewardIndex >= 0 && !rewards[rewardIndex].unlocked) {
      rewards[rewardIndex].unlocked = true;
      rewards[rewardIndex].unlockedAt = new Date().toISOString();
      saveRewards(rewards);
      return rewards[rewardIndex];
    }
    return null;
  } catch (error) {
    console.error('Error unlocking reward:', error);
    return null;
  }
};

// Stats
export const getShowerStats = (): ShowerStats => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!stats) {
      // Set a default last shower date that's 2 days ago
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const initialStats: ShowerStats = {
        totalSessions: 1,
        totalPoints: 10,
        longestShower: 120, // 2 minutes
        streakDays: 0,
        lastShowerDate: twoDaysAgo.toISOString(),
        level: 1,
        lastLevelUp: null
      };
      return initialStats;
    }
    
    const parsedStats = JSON.parse(stats);
    
    // Calculate streak
    if (parsedStats.lastShowerDate) {
      const lastShower = new Date(parsedStats.lastShowerDate);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If the last shower was today, maintain streak
      if (lastShower.toDateString() === today.toDateString()) {
        // Streak is already correct
      } 
      // If the last shower was yesterday, increment streak
      else if (lastShower.toDateString() === yesterday.toDateString()) {
        // Streak is already correct
      } 
      // Otherwise, reset streak
      else {
        parsedStats.streakDays = 0;
      }
    }
    
    return parsedStats;
  } catch (error) {
    console.error('Error getting shower stats:', error);
    // Set a default last shower date that's 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    return {
      totalSessions: 1,
      totalPoints: 10,
      longestShower: 120, // 2 minutes
      streakDays: 0,
      lastShowerDate: twoDaysAgo.toISOString(),
      level: 1,
      lastLevelUp: null
    };
  }
};

export const updateShowerStats = (stats: ShowerStats): ShowerStats => {
  try {
    // If it's a new day, update streak
    const currentStats = getShowerStats();
    const today = new Date().toDateString();
    
    if (currentStats.lastShowerDate) {
      const lastShowerDay = new Date(currentStats.lastShowerDate).toDateString();
      
      if (lastShowerDay !== today) {
        // New day, check if it's consecutive
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastShowerDay === yesterday.toDateString()) {
          // Last shower was yesterday, increment streak
          stats.streakDays = currentStats.streakDays + 1;
        }
      }
    } else {
      // First shower ever, start streak at 1
      stats.streakDays = 1;
    }
    
    // Check level progression
    const currentLevel = currentStats.level || 1;
    stats.level = currentLevel; // Ensure level is carried over if not provided
    
    // Find next level based on points
    const nextLevel = checkLevelProgression(stats);
    if (nextLevel > currentLevel) {
      stats.level = nextLevel;
      stats.lastLevelUp = new Date().toISOString();
    }
    
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error('Error updating shower stats:', error);
    return stats; // Return the original stats object even if there was an error
  }
};

// Check if the user has earned enough showers to level up
// New simplified system:
// - Levels 1-10: 1 shower per level
// - Levels 11-20: 2 showers per level
// - Levels 21+: 3 showers per level
const checkLevelProgression = (stats: ShowerStats): number => {
  try {
    // If no current level, default to 1
    const currentLevel = stats.level || 1;
    
    // Get the number of sessions since last level up
    let sessionsAfterLastLevel = 0;
    const sessions = getShowerSessions();
    
    if (stats.lastLevelUp) {
      const lastLevelUpDate = new Date(stats.lastLevelUp);
      sessionsAfterLastLevel = sessions.filter(
        (session: LocalShowerSession) => new Date(session.createdAt) > lastLevelUpDate
      ).length;
    } else {
      // If never leveled up before, count all sessions
      sessionsAfterLastLevel = sessions.length;
    }
    
    // Determine how many sessions needed for next level
    // For levels beyond 20, always require 3 showers
    const sessionsNeeded = currentLevel <= 10 ? 1 : 
                           currentLevel <= 20 ? 2 : 3;
    
    // Check if earned enough sessions for next level
    // No level cap - can progress infinitely
    if (sessionsAfterLastLevel >= sessionsNeeded) {
      return currentLevel + 1;
    }
    
    return currentLevel;
  } catch (error) {
    console.error('Error checking level progression:', error);
    return stats.level || 1;
  }
};

// Check if any rewards should be unlocked based on current progress
// Function to check for new rewards unlocks based on player progress
const checkAndUnlockRewards = (): void => {
  try {
    const stats = getShowerStats();
    const rewards = getRewards();
    let updated = false;
    
    // Unlock rewards based on total sessions
    if (stats.totalSessions >= 3) {
      const beginner = rewards.find(r => r.id === 'reward-1' && !r.unlocked);
      if (beginner) {
        beginner.unlocked = true;
        beginner.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }
    
    if (stats.totalSessions >= 7) {
      const regular = rewards.find(r => r.id === 'reward-2' && !r.unlocked);
      if (regular) {
        regular.unlocked = true;
        regular.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }
    
    // Unlock rewards based on points
    if (stats.totalPoints >= 300) {
      const swimmer = rewards.find(r => r.id === 'reward-3' && !r.unlocked);
      if (swimmer) {
        swimmer.unlocked = true;
        swimmer.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }
    
    if (stats.totalPoints >= 700) {
      const waterMaster = rewards.find(r => r.id === 'reward-4' && !r.unlocked);
      if (waterMaster) {
        waterMaster.unlocked = true;
        waterMaster.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }
    
    // Unlock rewards based on streak
    if (stats.streakDays >= 3) {
      const consistent = rewards.find(r => r.id === 'reward-5' && !r.unlocked);
      if (consistent) {
        consistent.unlocked = true;
        consistent.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }
    
    if (stats.streakDays >= 7) {
      const weeklyChamp = rewards.find(r => r.id === 'reward-6' && !r.unlocked);
      if (weeklyChamp) {
        weeklyChamp.unlocked = true;
        weeklyChamp.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }
    
    if (updated) {
      saveRewards(rewards);
    }
  } catch (error) {
    console.error('Error checking rewards:', error);
  }
};

// Loot system
export const getCollectedLoot = (): CollectedItem[] => {
  try {
    const loot = localStorage.getItem(STORAGE_KEYS.COLLECTED_LOOT);
    return loot ? JSON.parse(loot) : [];
  } catch (error) {
    console.error('Error getting collected loot:', error);
    return [];
  }
};

export const saveCollectedLoot = (items: CollectedItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COLLECTED_LOOT, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving collected loot:', error);
  }
};

export const addCollectedLoot = (item: LootItem): CollectedItem => {
  try {
    const collectedItems = getCollectedLoot();
    const existingItemIndex = collectedItems.findIndex(existing => existing.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Item already exists, increment count
      collectedItems[existingItemIndex].count += 1;
      saveCollectedLoot(collectedItems);
      return collectedItems[existingItemIndex];
    } else {
      // New item, add to collection
      const newCollectedItem: CollectedItem = {
        ...item,
        count: 1,
        firstCollectedAt: new Date().toISOString()
      };
      collectedItems.push(newCollectedItem);
      saveCollectedLoot(collectedItems);
      return newCollectedItem;
    }
  } catch (error) {
    console.error('Error adding collected loot:', error);
    // Return a default in case of error
    return {
      ...item,
      count: 1,
      firstCollectedAt: new Date().toISOString()
    };
  }
};

// Handle pending loot
export const getPendingLoot = (): LootItem | null => {
  try {
    const loot = localStorage.getItem(STORAGE_KEYS.PENDING_LOOT);
    return loot && loot !== "null" ? JSON.parse(loot) : null;
  } catch (error) {
    console.error('Error getting pending loot:', error);
    return null;
  }
};

export const setPendingLoot = (item: LootItem | null): void => {
  try {
    if (item) {
      localStorage.setItem(STORAGE_KEYS.PENDING_LOOT, JSON.stringify(item));
    } else {
      localStorage.setItem(STORAGE_KEYS.PENDING_LOOT, JSON.stringify(null));
    }
  } catch (error) {
    console.error('Error setting pending loot:', error);
  }
};

// Child name and onboarding functions
export const getChildName = (): string => {
  try {
    const name = localStorage.getItem(STORAGE_KEYS.CHILD_NAME);
    return name ? JSON.parse(name) : "Zoya"; // Default to Zoya if not set
  } catch (error) {
    console.error('Error getting child name:', error);
    return "Zoya"; // Default to Zoya in case of error
  }
};

export const setChildName = (name: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHILD_NAME, JSON.stringify(name));
  } catch (error) {
    console.error('Error setting child name:', error);
  }
};

export const isOnboardingCompleted = (): boolean => {
  try {
    const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed ? JSON.parse(completed) : false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const completeOnboarding = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(true));
  } catch (error) {
    console.error('Error completing onboarding:', error);
  }
};

export const resetOnboarding = (): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(false));
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};

// Function to calculate days since last shower date and update LAST_SHOWER_DAYS
export const updateDirtinessFromLastShower = (): number => {
  try {
    // Get the current stats to find the last shower date
    const stats = getShowerStats();
    
    // If there's no last shower date, set an initial dirtiness level
    if (!stats.lastShowerDate) {
      // Set initial dirtiness to 3 days for testing
      const initialDirtiness = 3;
      localStorage.setItem(STORAGE_KEYS.LAST_SHOWER_DAYS, JSON.stringify(initialDirtiness));
      
      // Update the last shower date in stats
      const date = new Date();
      date.setDate(date.getDate() - initialDirtiness);
      stats.lastShowerDate = date.toISOString();
      updateShowerStats(stats);
      
      console.log(`Set initial dirtiness to ${initialDirtiness} days`);
      return initialDirtiness;
    }
    
    // For testing purposes: check if we already have a dirtiness value
    const currentDirtiness = localStorage.getItem(STORAGE_KEYS.LAST_SHOWER_DAYS);
    if (currentDirtiness) {
      // Parse the current dirtiness
      const currentDays = JSON.parse(currentDirtiness);
      
      // If we're in testing mode, artificially increment the dirtiness 
      // (for normal operation we'd use the actual date calculation below)
      if (currentDays < 7) {
        // Much lower chance (10%) of increasing dirtiness for testing
        // This will make days progress about once per 10 checks (approx. 50 seconds per day)
        if (Math.random() < 0.1) {
          const newDays = currentDays + 1;
          localStorage.setItem(STORAGE_KEYS.LAST_SHOWER_DAYS, JSON.stringify(newDays));
          
          // Also update the lastShowerDate in stats to match
          const newDate = new Date();
          newDate.setDate(newDate.getDate() - newDays);
          stats.lastShowerDate = newDate.toISOString();
          updateShowerStats(stats);
          
          console.log(`TESTING: Increased dirtiness to ${newDays} days`);
          return newDays;
        }
        return currentDays;
      }
    }
    
    // Normal operation calculation (for production)
    // Calculate days difference
    const lastShowerDate = new Date(stats.lastShowerDate);
    const today = new Date();
    
    // Reset time components to get accurate day difference
    lastShowerDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = Math.abs(today.getTime() - lastShowerDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Cap at 7 days maximum dirtiness
    const daysSinceShower = Math.min(diffDays, 7);
    
    // Update the last shower days value in storage
    localStorage.setItem(STORAGE_KEYS.LAST_SHOWER_DAYS, JSON.stringify(daysSinceShower));
    
    console.log(`Updated dirtiness: ${daysSinceShower} days since last shower`);
    return daysSinceShower;
  } catch (error) {
    console.error('Error updating dirtiness from last shower:', error);
    return 0;
  }
};

// Functions to track when a shower is in progress to prevent dirtiness updates
export const setShowerInProgress = (inProgress: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOWER_IN_PROGRESS, JSON.stringify(inProgress));
  } catch (error) {
    console.error('Error setting shower in progress state:', error);
  }
};

export const isShowerInProgress = (): boolean => {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.SHOWER_IN_PROGRESS);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error checking if shower is in progress:', error);
    return false;
  }
};

// Last shower days functions
export const getLastShowerDays = (): number => {
  try {
    // Check if a shower is currently in progress - don't update dirtiness if so
    if (isShowerInProgress()) {
      // Just return the current value without updating
      const days = localStorage.getItem(STORAGE_KEYS.LAST_SHOWER_DAYS);
      return days ? JSON.parse(days) : 0;
    }
    
    // Get the current value first
    const currentDaysStr = localStorage.getItem(STORAGE_KEYS.LAST_SHOWER_DAYS);
    const currentDays = currentDaysStr ? JSON.parse(currentDaysStr) : 0;
    
    // Only update if we're not already clean (0 days) to prevent overriding recent showers
    if (currentDays > 0) {
      updateDirtinessFromLastShower();
    }
    
    // Then get the updated value
    const days = localStorage.getItem(STORAGE_KEYS.LAST_SHOWER_DAYS);
    return days ? JSON.parse(days) : 0; // Default to 0 days (today) if not set
  } catch (error) {
    console.error('Error getting last shower days:', error);
    return 0; // Default to 0 in case of error
  }
};

export const setLastShowerDays = (days: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SHOWER_DAYS, JSON.stringify(days));
    
    // Also update the last shower date in stats based on the number of days
    const stats = getShowerStats();
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    stats.lastShowerDate = date.toISOString();
    updateShowerStats(stats);
  } catch (error) {
    console.error('Error setting last shower days:', error);
  }
};

// Reset all user data in storage
export const resetAllUserData = (): void => {
  try {
    // Clear all existing data
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.REWARDS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.COLLECTED_LOOT);
    localStorage.removeItem(STORAGE_KEYS.PENDING_LOOT);
    localStorage.removeItem(STORAGE_KEYS.CHILD_NAME);
    localStorage.removeItem(STORAGE_KEYS.LAST_SHOWER_DAYS);
    localStorage.removeItem(STORAGE_KEYS.SHOWER_IN_PROGRESS); // Reset shower in progress flag
    resetOnboarding(); // Reset onboarding but don't remove it
    
    // Re-initialize with default values
    initializeStorage();
    
    // Explicitly set shower in progress to false
    setShowerInProgress(false);
  } catch (error) {
    console.error('Error resetting user data:', error);
  }
};

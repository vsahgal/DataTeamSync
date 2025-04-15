import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { 
  saveShowerSession, 
  getShowerStats, 
  updateShowerStats, 
  setLastShowerDays,
  getLastShowerDays
} from '@/lib/storage';
import { MAX_SHOWER_TIME, WATER_TOGGLE_INTERVAL, LEVELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { ShowerStats } from '@shared/schema';

export default function useShowerState() {
  const { toast } = useToast();
  const [isShowering, setIsShowering] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWaterOn, setIsWaterOn] = useState(true);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [waterToggleId, setWaterToggleId] = useState<number | null>(null);
  const [didLevelUp, setDidLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);

  // Start the shower
  const startShower = useCallback(() => {
    // Mark that a shower is in progress to prevent dirtiness updates
    setShowerInProgress(true);
    
    setIsShowering(true);
    setElapsedTime(0);
    setIsWaterOn(true);
    
    // Start the timer
    const id = window.setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
    setIntervalId(id);
    
    // Set up water animation toggle
    const toggleId = window.setInterval(() => {
      setIsWaterOn(prev => !prev);
    }, WATER_TOGGLE_INTERVAL);
    setWaterToggleId(toggleId);
    
    console.log("🚿 SHOWER STARTED - Setting shower in progress flag");
  }, []);
  
  // Stop the shower and calculate points
  const stopShower = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (waterToggleId) {
      clearInterval(waterToggleId);
      setWaterToggleId(null);
    }
    
    setIsShowering(false);
    
    // For testing purposes, shorten the shower duration and award more points
    // Make a minimum of 5 seconds to count as a shower
    const effectiveTime = Math.max(5, elapsedTime);
    const finalPoints = 50; // Temporary increase for testing
    
    // Save the session
    saveShowerSession({
      id: nanoid(),
      duration: effectiveTime, // Use the effective time for duration
      points: finalPoints,
      completed: true,
      createdAt: new Date().toISOString()
    });
    
    // Get current stats before update
    const currentStats = getShowerStats();
    
    // Shower session has already been saved - the checkLevelProgression function in storage.ts
    // will now handle level progression based on sessions instead of points
    // We still need to get the current stats
    const currentLevel = currentStats.level || 1;
    
    // Create updated stats object
    const updatedStats: ShowerStats = {
      ...currentStats,
      totalSessions: currentStats.totalSessions + 1,
      totalPoints: currentStats.totalPoints + finalPoints,
      longestShower: Math.max(currentStats.longestShower, effectiveTime),
      lastShowerDate: new Date().toISOString()
    };
    
    // Update stats in storage
    updateShowerStats(updatedStats);
    
    // Reset the last shower days to 0 (today) since we just had a shower
    console.log("🚿 SETTING DIRTINESS TO 0 - Shower completed!");
    setLastShowerDays(0);
    
    // Double-check that it was reset correctly
    setTimeout(() => {
      const currentDirtiness = getLastShowerDays();
      console.log("🚿 After shower, dirtiness level is now:", currentDirtiness);
      
      // Reset the shower in progress flag after a delay to ensure no dirtiness updates happen
      // while we're showing the clean unicorn
      setTimeout(() => {
        setShowerInProgress(false);
        console.log("🚿 SHOWER COMPLETED - Shower in progress flag reset");
      }, 5000); // 5 second delay to keep the unicorn clean for a bit
    }, 100);
    
    // Get the fresh stats to check if level-up occurred
    const freshStats = getShowerStats();
    
    // Check if there was a level-up (with fallback to current level if it's undefined)
    const freshLevel = freshStats.level || currentLevel;
    if (freshLevel > currentLevel) {
      // Set level up state for animations
      console.log("Level up detected! From level", currentLevel, "to level", freshLevel);
      setDidLevelUp(true);
      setNewLevel(freshLevel);
    }
    // We've removed the forced level-up testing code that was triggering on every shower
    
    return finalPoints;
  }, [intervalId, waterToggleId, elapsedTime, toast]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (waterToggleId) clearInterval(waterToggleId);
    };
  }, [intervalId, waterToggleId]);
  
  // Reset level up animation state
  const resetLevelUp = useCallback(() => {
    setDidLevelUp(false);
    setNewLevel(null);
  }, []);

  return {
    isShowering,
    elapsedTime,
    // For testing: showing 50 points instead of 10
    points: 50,
    isWaterOn,
    startShower,
    stopShower,
    didLevelUp,
    newLevel,
    resetLevelUp
  };
}

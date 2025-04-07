import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { saveShowerSession, getShowerStats, updateShowerStats } from '@/lib/storage';
import { MAX_SHOWER_TIME, WATER_TOGGLE_INTERVAL, LEVELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

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
    
    // Fixed points reward - always 10 points per shower
    const finalPoints = 10;
    
    // Save the session
    saveShowerSession({
      id: nanoid(),
      duration: elapsedTime,
      points: finalPoints,
      completed: true,
      createdAt: new Date().toISOString()
    });
    
    // Get current stats before update
    const currentStats = getShowerStats();
    
    // Check if this update will cause a level-up
    const currentLevel = currentStats.level || 1;
    const newTotalPoints = currentStats.totalPoints + finalPoints;
    
    // Find potential new level
    let newLevel = currentLevel;
    for (const level of LEVELS) {
      if (newTotalPoints >= level.pointsNeeded && level.level > newLevel) {
        newLevel = level.level;
      }
    }
    
    // Update stats
    updateShowerStats({
      ...currentStats,
      totalSessions: currentStats.totalSessions + 1,
      totalPoints: newTotalPoints,
      longestShower: Math.max(currentStats.longestShower, elapsedTime),
      lastShowerDate: new Date().toISOString()
    });
    
    // Check if there was a level-up
    if (newLevel > currentLevel) {
      const newLevelInfo = LEVELS.find(l => l.level === newLevel);
      if (newLevelInfo) {
        // Set level up state for animations
        setDidLevelUp(true);
        setNewLevel(newLevel);
      }
    }
    
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
    // Fixed reward of 10 points per shower
    points: 10,
    isWaterOn,
    startShower,
    stopShower,
    didLevelUp,
    newLevel,
    resetLevelUp
  };
}

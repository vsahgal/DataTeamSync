import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { saveShowerSession, getShowerStats, updateShowerStats } from '@/lib/storage';
import { POINTS_PER_SECOND, MAX_SHOWER_TIME, WATER_TOGGLE_INTERVAL } from '@/lib/constants';

export default function useShowerState() {
  const [isShowering, setIsShowering] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [points, setPoints] = useState(0);
  const [isWaterOn, setIsWaterOn] = useState(true);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [waterToggleId, setWaterToggleId] = useState<number | null>(null);

  // Start the shower
  const startShower = useCallback(() => {
    setIsShowering(true);
    setElapsedTime(0);
    setPoints(0);
    setIsWaterOn(true);
    
    // Start the timer
    const id = window.setInterval(() => {
      setElapsedTime(prevTime => {
        // Calculate new points - with diminishing returns after optimal time
        if (prevTime < MAX_SHOWER_TIME) {
          setPoints(prevPoints => Math.floor(prevPoints + POINTS_PER_SECOND));
        } else {
          // Reduce points for excessively long showers
          setPoints(prevPoints => Math.max(0, Math.floor(prevPoints - (POINTS_PER_SECOND / 2))));
        }
        return prevTime + 1;
      });
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
    
    // Calculate final points
    const finalPoints = Math.max(10, points);
    
    // Save the session
    saveShowerSession({
      id: nanoid(),
      duration: elapsedTime,
      points: finalPoints,
      completed: true,
      createdAt: new Date().toISOString()
    });
    
    // Update stats
    const stats = getShowerStats();
    updateShowerStats({
      ...stats,
      totalSessions: stats.totalSessions + 1,
      totalPoints: stats.totalPoints + finalPoints,
      longestShower: Math.max(stats.longestShower, elapsedTime),
      lastShowerDate: new Date().toISOString()
    });
    
    return finalPoints;
  }, [intervalId, waterToggleId, elapsedTime, points]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (waterToggleId) clearInterval(waterToggleId);
    };
  }, [intervalId, waterToggleId]);
  
  return {
    isShowering,
    elapsedTime,
    points,
    isWaterOn,
    startShower,
    stopShower
  };
}

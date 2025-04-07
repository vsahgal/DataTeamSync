import React, { useEffect, useState, useRef } from 'react';
import { LEVELS } from '@/lib/constants';

interface AnimatedLevelIndicatorProps {
  previousLevel: number;
  targetLevel: number;
  isAnimating: boolean;
  onAnimationComplete?: () => void;
}

export default function AnimatedLevelIndicator({ 
  previousLevel, 
  targetLevel, 
  isAnimating, 
  onAnimationComplete 
}: AnimatedLevelIndicatorProps) {
  const [currentDisplayLevel, setCurrentDisplayLevel] = useState(previousLevel);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [glow, setGlow] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Helper function to get level info even for levels beyond the predefined ones
  const getLevelInfo = (level: number) => {
    // Check if it's a predefined level
    const predefinedLevel = LEVELS.find(l => l.level === level);
    if (predefinedLevel) {
      return predefinedLevel;
    }
    
    // Generate level info for higher levels
    const levelNames = [
      "Legendary Cleanser",
      "Mythical Washer",
      "Cosmic Bather",
      "Galactic Showerer",
      "Universal Scrubber",
      "Stellar Soaper",
      "Interstellar Hygienist",
      "Celestial Washer"
    ];
    
    // Pick a name based on the level (cycling through the options)
    const nameIndex = (level - LEVELS.length - 1) % levelNames.length;
    
    // Generate colors by cycling through a rainbow pattern
    const hue = ((level - LEVELS.length - 1) * 30) % 360;
    
    return {
      level,
      name: levelNames[nameIndex],
      pointsNeeded: 10000 + (level - LEVELS.length) * 500,
      color: `hsl(${hue}, 80%, 60%)`,
      showersNeeded: 3 // All levels beyond the predefined ones need 3 showers
    };
  };
  
  // Get color information for the levels
  const previousLevelInfo = getLevelInfo(previousLevel);
  const targetLevelInfo = getLevelInfo(targetLevel);
  
  // Get the current level's color based on the animation state
  const currentLevelInfo = getLevelInfo(currentDisplayLevel);
  
  useEffect(() => {
    if (!isAnimating) {
      setCurrentDisplayLevel(previousLevel);
      setScale(1);
      setRotation(0);
      setGlow(0);
      return;
    }
    
    let startTime: number | null = null;
    const totalDuration = 2000; // 2 seconds for the entire animation
    const levelUpTime = 1000; // At halfway through, level up
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Pulse animation for the level
      if (progress < 0.5) {
        // First half: growing and glowing effect
        const firstHalfProgress = progress / 0.5;
        setScale(1 + firstHalfProgress * 0.3); // Grow by 30%
        setRotation(firstHalfProgress * -3); // Slight rotation
        setGlow(firstHalfProgress * 10); // Increase glow
      } else {
        // Second half: decrease effect and update level
        const secondHalfProgress = (progress - 0.5) / 0.5;
        
        // If we just crossed the 0.5 threshold, update the displayed level
        if (Math.floor(elapsed) === Math.floor(levelUpTime) && currentDisplayLevel !== targetLevel) {
          setCurrentDisplayLevel(targetLevel);
        }
        
        setScale(1.3 - secondHalfProgress * 0.3); // Return to normal size
        setRotation(-3 + secondHalfProgress * 3); // Return to no rotation
        setGlow(10 - secondHalfProgress * 10); // Decrease glow
      }
      
      if (progress < 1) {
        // Continue the animation if not complete
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure we end with the correct values
        setCurrentDisplayLevel(targetLevel);
        setScale(1);
        setRotation(0);
        setGlow(0);
        
        // Call the completion callback
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    };
    
    // Start the animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, previousLevel, targetLevel, onAnimationComplete, currentDisplayLevel]);
  
  return (
    <div className="flex items-center gap-2 mb-1">
      <div 
        className="bg-blue-100 px-3 py-1 rounded-full transition-all duration-200"
        style={{ 
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          boxShadow: `0 0 ${glow}px ${currentLevelInfo.color}`,
          transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
        }}
      >
        <span 
          className="text-lg font-bold transition-colors duration-200"
          style={{ color: currentLevelInfo.color }}
        >
          Level {currentDisplayLevel}
        </span>
      </div>
      <span className="text-lg font-medium text-blue-600 transition-all duration-200">•</span>
      <span 
        className="text-lg font-medium text-blue-600 transition-colors duration-200"
        style={{ 
          color: currentDisplayLevel === targetLevel ? targetLevelInfo.color : previousLevelInfo.color 
        }}
      >
        {currentDisplayLevel === targetLevel ? targetLevelInfo.name : previousLevelInfo.name}
      </span>
    </div>
  );
}
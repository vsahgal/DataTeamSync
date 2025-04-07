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
    const totalDuration = 3000; // 3 seconds for the entire animation
    const levelUpTime = 1500; // At halfway through, level up
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Pulse animation for the level
      if (progress < 0.5) {
        // First half: growing and glowing effect
        const firstHalfProgress = progress / 0.5;
        // More dramatic animation
        setScale(1 + firstHalfProgress * 0.6); // Grow by 60%
        setRotation(firstHalfProgress * -6); // More rotation
        setGlow(firstHalfProgress * 20); // More glow
      } else {
        // Second half: decrease effect and update level
        const secondHalfProgress = (progress - 0.5) / 0.5;
        
        // If we just crossed the 0.5 threshold, update the displayed level
        if (Math.floor(elapsed) === Math.floor(levelUpTime) && currentDisplayLevel !== targetLevel) {
          setCurrentDisplayLevel(targetLevel);
          
          // Add some extra effects at the moment of level-up
          setScale(1.8); // Extra pulse at level change
          setGlow(25); // Extra glow at level change
        }
        
        setScale(1.6 - secondHalfProgress * 0.6); // Return to normal size
        setRotation(-6 + secondHalfProgress * 6); // Return to no rotation
        setGlow(20 - secondHalfProgress * 20); // Decrease glow
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
    <div className="flex items-center gap-2 mb-1 relative">
      {/* LEVEL UP! text that appears momentarily during the level up */}
      {isAnimating && currentDisplayLevel === targetLevel && (
        <div 
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 font-bold text-xl"
          style={{ 
            color: currentLevelInfo.color,
            opacity: Math.min(1, glow/20),
            textShadow: `0 0 ${glow/2}px ${currentLevelInfo.color}`
          }}
        >
          LEVEL UP!
        </div>
      )}
      
      {/* The level indicator */}
      <div 
        className="bg-blue-100 px-4 py-1.5 rounded-full transition-all duration-200"
        style={{ 
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          boxShadow: `0 0 ${glow}px ${currentLevelInfo.color}`,
          borderColor: currentLevelInfo.color,
          borderWidth: isAnimating ? '2px' : '0px',
          transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.3s'
        }}
      >
        <span 
          className="text-xl font-bold transition-colors duration-200"
          style={{ color: currentLevelInfo.color }}
        >
          Level {currentDisplayLevel}
        </span>
      </div>
      
      <span className="text-lg font-medium text-blue-600 transition-all duration-200">•</span>
      
      {/* The level name */}
      <span 
        className="text-lg font-medium transition-colors duration-200"
        style={{ 
          color: currentDisplayLevel === targetLevel ? targetLevelInfo.color : previousLevelInfo.color,
          transform: isAnimating ? `scale(${scale * 0.8})` : 'scale(1)',
          transition: 'transform 0.1s ease-out, color 0.3s'
        }}
      >
        {currentDisplayLevel === targetLevel ? targetLevelInfo.name : previousLevelInfo.name}
      </span>
    </div>
  );
}
import React, { useEffect, useState } from 'react';

interface LevelUpAnimationProps {
  isVisible: boolean;
  level: number;
  color: string;
  onAnimationComplete?: () => void;
}

export default function LevelUpAnimation({ isVisible, level, color, onAnimationComplete }: LevelUpAnimationProps) {
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Animation sequence
    let step = 0;
    const totalSteps = 45; // 1.5 seconds
    const animationInterval = setInterval(() => {
      // Pulse animation
      const progress = step / totalSteps;
      
      if (progress < 0.3) {
        // First phase: grow and fade in
        setScale(1 + progress * 3);
        setOpacity(progress * 3);
        setRotation(progress * 15);
      } else if (progress < 0.7) {
        // Second phase: pulse
        const pulseProgress = (progress - 0.3) / 0.4;
        setScale(1.9 + Math.sin(pulseProgress * Math.PI * 2) * 0.4);
        setOpacity(0.9);
        setRotation(5 - pulseProgress * 10);
      } else {
        // Third phase: fade out and shrink
        const fadeOutProgress = (progress - 0.7) / 0.3;
        setScale(1.9 - fadeOutProgress * 0.9);
        setOpacity(0.9 - fadeOutProgress * 0.9);
        setRotation(-5 + fadeOutProgress * 5);
      }
      
      step++;
      
      if (step >= totalSteps) {
        clearInterval(animationInterval);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, 33); // ~30fps
    
    return () => {
      clearInterval(animationInterval);
    };
  }, [isVisible, onAnimationComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      <div 
        className="bg-white rounded-full px-6 py-3 flex items-center shadow-lg border-2"
        style={{ 
          borderColor: color,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity,
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
        }}
      >
        <div className="text-3xl font-bold mr-2" style={{ color }}>
          {level}
        </div>
        <div className="text-2xl font-bold" style={{ color }}>
          LEVEL UP!
        </div>
      </div>
    </div>
  );
}
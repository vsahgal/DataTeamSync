import React, { useEffect, useState } from 'react';

interface DancingUnicornProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export default function DancingUnicorn({ isVisible, onAnimationComplete }: DancingUnicornProps) {
  const [position, setPosition] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    if (!isVisible) return;
    
    // Dancing animation sequence
    let animationFrameId: number;
    let step = 0;
    const totalSteps = 60; // 2 seconds at 30fps
    
    const animate = () => {
      // Calculate progress (0 to 1)
      const progress = step / totalSteps;
      
      // Bouncy movement
      setPosition(Math.sin(progress * Math.PI * 4) * 15);
      
      // Rotation
      setRotation(Math.sin(progress * Math.PI * 3) * 10);
      
      // Scale breathing effect
      setScale(1 + Math.sin(progress * Math.PI * 5) * 0.1);
      
      step++;
      
      if (step <= totalSteps) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, onAnimationComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
      style={{
        transform: `translateY(${position}px) rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Clean dancing unicorn */}
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="150" cy="160" rx="80" ry="60" fill="#EECEE7"/>
        
        <rect x="90" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
        <rect x="120" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
        <rect x="165" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
        <rect x="195" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
        
        <ellipse cx="200" cy="120" rx="40" ry="30" fill="#EECEE7"/>
        
        {/* Happy eyes */}
        <circle cx="210" cy="110" r="5" fill="white" />
        <circle cx="210" cy="110" r="2" fill="#333" />
        <circle cx="180" cy="110" r="5" fill="white" />
        <circle cx="180" cy="110" r="2" fill="#333" />
        
        {/* Happy smile */}
        <path 
          d="M190 125 Q205 135 220 125" 
          stroke="#333" 
          strokeWidth="2" 
          fill="none"
        />
        
        <path d="M205 90 L220 60" stroke="#FFB6D9" strokeWidth="8" strokeLinecap="round"/>
        <ellipse cx="160" cy="120" rx="12" ry="20" fill="#FFB6D9" />
        <ellipse cx="145" cy="120" rx="12" ry="20" fill="#B5DEFF"/>
        <ellipse cx="130" cy="120" rx="12" ry="20" fill="#D9B5FF"/>
        <ellipse cx="115" cy="120" rx="12" ry="20" fill="#B5FFD9"/>
        <ellipse cx="100" cy="120" rx="12" ry="20" fill="#FFB6D9"/>
        <path d="M70 160 Q50 120 70 80" stroke="#FFB6D9" strokeWidth="10" strokeLinecap="round" fill="none"/>
        
        {/* Sparkles */}
        <g className="animate-pulse">
          <path d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" fill="#FFD700" transform="translate(240, 80) scale(0.6)"/>
          <path d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" fill="#FFD700" transform="translate(60, 140) scale(0.5)"/>
          <path d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" fill="#FFD700" transform="translate(130, 80) scale(0.7)"/>
        </g>
      </svg>
    </div>
  );
}
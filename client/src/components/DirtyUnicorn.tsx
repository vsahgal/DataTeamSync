import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import newUnicornImage from "../assets/new-unicorn.png";

interface DirtyUnicornProps {
  dirtiness: number; // Scale of 0-7, where 0 is clean and 7 is the dirtiest
  isDancing?: boolean; // Flag to trigger dancing animation
  onDanceComplete?: () => void; // Callback for when dance animation completes
}

export default function DirtyUnicorn({ 
  dirtiness = 3, 
  isDancing = false, 
  onDanceComplete 
}: DirtyUnicornProps) {
  const [showSmell1, setShowSmell1] = useState(false);
  const [showSmell2, setShowSmell2] = useState(false);
  const [showSmell3, setShowSmell3] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [showRainbow, setShowRainbow] = useState(true);
  const [sigh, setSigh] = useState(false);
  
  // Dancing animation states
  const [position, setPosition] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number | null>(null);
  
  // Only show dirt when dirtiness is greater than 0
  const isClean = dirtiness === 0;
  
  // Adjust opacity of dirt spots based on dirtiness level (1-7)
  const baseOpacity = 0.3;
  const dirtOpacity = baseOpacity + (dirtiness * 0.35); // Dramatically increases with dirtiness (3x more than before)
  
  // Track if the unicorn is crying (only when very dirty, level 6-7)
  const [isCrying, setIsCrying] = useState(false);
  
  // Handle regular animations like sparkles, rainbows, and smell clouds
  useEffect(() => {
    if (isClean) {
      // Sparkle animation for clean unicorn
      const sparkleInterval = setInterval(() => {
        setSparkle(prev => !prev);
      }, 1500);
      
      // Set rainbow to always be visible for clean unicorn
      setShowRainbow(true);
      
      return () => {
        clearInterval(sparkleInterval);
      };
    } else if (dirtiness >= 2) { // Only show smell clouds when dirtiness is at least 2
      // First smell cloud animation
      const smell1Interval = setInterval(() => {
        setShowSmell1(prev => !prev);
      }, 2000);
      
      // Second smell cloud animation (offset timing) - only when dirtier
      const smell2Interval = dirtiness >= 3 ? setInterval(() => {
        setShowSmell2(prev => !prev);
      }, 3000) : null;
      
      // Third smell cloud for very dirty unicorn
      const smell3Interval = dirtiness >= 5 ? setInterval(() => {
        setShowSmell3(prev => !prev);
      }, 2500) : null;
      
      // Sighing animation - more frequent when dirtier
      const sighInterval = setInterval(() => {
        setSigh(true);
        setTimeout(() => setSigh(false), 500);
      }, dirtiness >= 5 ? 2000 : 4000);
      
      // Crying animation for very dirty unicorn (days 6-7)
      // Much more frequent crying for day 7 vs day 6
      const cryingInterval = dirtiness >= 6 ? setInterval(() => {
        setIsCrying(true);
        // Longer crying duration for day 7
        setTimeout(() => setIsCrying(false), dirtiness >= 7 ? 1800 : 1200);
      }, dirtiness >= 7 ? 2000 : 4000) : null;
      
      return () => {
        clearInterval(smell1Interval);
        if (smell2Interval) clearInterval(smell2Interval);
        if (smell3Interval) clearInterval(smell3Interval);
        clearInterval(sighInterval);
        if (cryingInterval) clearInterval(cryingInterval);
      };
    } else {
      // Dirtiness level 1 - no smell clouds, just occasional sighing
      const sighInterval = setInterval(() => {
        setSigh(true);
        setTimeout(() => setSigh(false), 500);
      }, 6000); // Less frequent sighing
      
      return () => {
        clearInterval(sighInterval);
      };
    }
  }, [dirtiness, isClean]);
  
  // Handle dancing animation
  useEffect(() => {
    if (!isDancing) {
      // Reset animation states when not dancing
      setPosition(0);
      setRotation(0);
      setScale(1);
      
      // Clear any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    // Dancing animation sequence
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
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (onDanceComplete) {
          onDanceComplete();
        }
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDancing, onDanceComplete]);
  
  return (
    <div 
      className="relative w-54 h-54 mx-auto"
      style={{
        transform: isDancing ? `translateY(${position}px) rotate(${rotation}deg) scale(${scale})` : 'none',
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Use the new unicorn image */}
      <div className="relative w-full h-full">
        {/* Base unicorn image */}
        <img 
          src={newUnicornImage} 
          alt="Unicorn" 
          className="w-full h-full object-contain"
        />
        
        {/* Overlay dirt spots if the unicorn is dirty */}
        {!isClean && (
          <div className="absolute inset-0 w-full h-full">
            {/* Apply dirt spots dynamically based on dirtiness level */}
            <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
              {/* Dirt spots on body - dynamically scaled with dirtiness */}
              <circle cx="150" cy="150" r={16 + Math.min(4, dirtiness) * 3} fill="#A67F75" fillOpacity={dirtOpacity} />
              <circle cx="180" cy="180" r={13 + Math.min(5, dirtiness) * 3} fill="#A67F75" fillOpacity={dirtOpacity - 0.05} />
              <circle cx="120" cy="170" r={10 + Math.min(6, dirtiness) * 3} fill="#A67F75" fillOpacity={dirtOpacity - 0.1} />
              
              {/* Extra dirt spots for very dirty unicorns */}
              {dirtiness >= 4 && (
                <>
                  <circle cx="160" cy="160" r={10 + (dirtiness - 4) * 6} fill="#A67F75" fillOpacity={dirtOpacity} />
                  <circle cx="200" cy="150" r={8 + (dirtiness - 4) * 6} fill="#A67F75" fillOpacity={dirtOpacity - 0.1} />
                </>
              )}
              
              {/* Even more dirt spots for extremely dirty unicorns (days 5-7) */}
              {dirtiness >= 5 && (
                <>
                  <circle cx="140" cy="140" r={7 + (dirtiness - 5) * 8} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
                  <circle cx="180" cy="130" r={6 + (dirtiness - 5) * 8} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
                  <circle cx="110" cy="155" r={8 + (dirtiness - 5) * 6} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
                  
                  {/* Additional dirt spots for extremely dirty unicorn */}
                  <circle cx="130" cy="190" r={9 + (dirtiness - 5) * 5} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
                  <circle cx="175" cy="170" r={8 + (dirtiness - 5) * 5} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
                </>
              )}
              
              {/* Dirt on face, focused on unicorn's head area */}
              {dirtiness >= 3 && (
                <>
                  <circle cx="140" cy="80" r={8 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
                </>
              )}
              
              {dirtiness >= 5 && (
                <>
                  <circle cx="160" cy="70" r={7 + (dirtiness - 5) * 3} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
                  <circle cx="130" cy="90" r={6 + (dirtiness - 5) * 2} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
                </>
              )}
              
              {/* Extra dirt spots for extremely dirty unicorn (days 6-7) */}
              {dirtiness >= 6 && (
                <>
                  <circle cx="150" cy="60" r={10 + (dirtiness - 6) * 4} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
                  <circle cx="170" cy="85" r={8 + (dirtiness - 6) * 3} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
                </>
              )}
            </svg>
          </div>
        )}
        
        {/* Show sad face overlay for dirty unicorn */}
        {!isClean && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sad eyes expression - only visible for dirtier unicorns */}
              {dirtiness >= 4 && (
                <>
                  {/* Sad eyebrows */}
                  <path 
                    d="M120 70 L135 80" 
                    stroke="#333" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    style={{ opacity: Math.min(1, (dirtiness - 3) * 0.3) }}
                  />
                  <path 
                    d="M160 80 L145 70" 
                    stroke="#333" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    style={{ opacity: Math.min(1, (dirtiness - 3) * 0.3) }}
                  />
                </>
              )}
              
              {/* Tears for very dirty unicorn */}
              {isCrying && dirtiness >= 6 && (
                <>
                  <path 
                    d="M125 85 C125 95, 125 105, 125 115" 
                    stroke="#8CDBFF" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    style={{ opacity: 0.8 }}
                  />
                  <path 
                    d="M155 85 C155 95, 155 105, 155 120" 
                    stroke="#8CDBFF" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    style={{ opacity: 0.8 }}
                  />
                </>
              )}
            </svg>
          </div>
        )}
      </div>
      
      {/* Smell cloud 1 - gets bigger and darker with dirtiness */}
      {!isClean && dirtiness >= 2 && (
        <div 
          className={`absolute top-10 right-8 transform transition-all duration-700 ease-in-out ${
            showSmell1 ? 'opacity-80 translate-y-[-10px]' : 'opacity-0 translate-y-0'
          }`}
          style={{ 
            transform: `scale(${1 + Math.min(0.4, dirtiness * 0.05)})`,
            opacity: dirtiness >= 6 ? 0.9 : 0.8
          }}
        >
          <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M5 25C2.5 25 1 23.5 1 20.5C1 17.5 3 16 5 16C5 13 7 10 10 10C13 10 15 12 16 14C17 12 19 11 21 11C24 11 26 13 26 16C28 16 30 18 30 21C30 24 28 25 26 25C25.5 25 5.5 25 5 25Z" 
              fill={dirtiness >= 6 ? "#888888" : "#AAAAAA"} 
              fillOpacity={0.6 + Math.min(0.3, dirtiness * 0.05)}
            />
            <text x="15" y="20" fontSize={dirtiness >= 6 ? "10" : "8"} fill="#555">~</text>
          </svg>
        </div>
      )}
      
      {/* Smell cloud 2 - gets bigger and darker with dirtiness */}
      {!isClean && dirtiness >= 3 && (
        <div 
          className={`absolute top-5 left-10 transform transition-all duration-700 ease-in-out ${
            showSmell2 ? 'opacity-80 translate-y-[-8px]' : 'opacity-0 translate-y-0'
          }`}
          style={{ 
            transform: `scale(${1 + Math.min(0.5, dirtiness * 0.06)})`,
            opacity: dirtiness >= 6 ? 0.9 : 0.8
          }}
        >
          <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M3 20C1.5 20 1 18.5 1 16.5C1 14.5 2 13 3.5 13C3.5 11 5 8 7.5 8C10 8 11.5 10 12 11.5C12.5 10 14 9 15.5 9C17.5 9 19 10.5 19 13C20.5 13 22 14.5 22 17C22 19.5 20.5 20 19 20C18.5 20 3.5 20 3 20Z" 
              fill={dirtiness >= 6 ? "#888888" : "#AAAAAA"} 
              fillOpacity={0.6 + Math.min(0.3, dirtiness * 0.05)}
            />
            <text x="11" y="16" fontSize={dirtiness >= 6 ? "8" : "6"} fill="#555">~</text>
          </svg>
        </div>
      )}
      
      {/* Smell cloud 3 - only appears for very dirty unicorn (level 5+), gets bigger for day 7 */}
      {!isClean && dirtiness >= 5 && (
        <div 
          className={`absolute top-12 left-32 transform transition-all duration-700 ease-in-out ${
            showSmell3 ? 'opacity-80 translate-y-[-12px]' : 'opacity-0 translate-y-0'
          }`}
          style={{ 
            transform: `scale(${1 + Math.min(0.6, (dirtiness - 5) * 0.25)})`,
            opacity: dirtiness >= 6 ? 0.9 : 0.8
          }}
        >
          <svg width="35" height="28" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M4 22C2 22 1 20 1 17.5C1 15 2.5 13.5 4.5 13.5C4.5 11 6.5 7.5 9.5 7.5C12.5 7.5 14.5 10 15 12C16 10 18 9 20 9C23 9 25 11 25 14C27 14 29 16 29 19C29 22 27 22.5 25 22.5C24.5 22.5 4.5 22 4 22Z" 
              fill={dirtiness >= 6 ? "#888888" : "#AAAAAA"} 
              fillOpacity={0.7 + Math.min(0.2, (dirtiness - 5) * 0.1)}
            />
            <text x="13" y="17" fontSize={dirtiness >= 6 ? "9" : "7"} fill="#555">~</text>
          </svg>
        </div>
      )}
      
      {/* Extra smell cloud 4 - only appears for extremely dirty unicorn (level 7) */}
      {!isClean && dirtiness >= 7 && (
        <div 
          className={`absolute top-8 right-28 transform transition-all duration-700 ease-in-out ${
            showSmell1 ? 'opacity-90 translate-y-[-15px]' : 'opacity-0 translate-y-0'
          }`}
        >
          <svg width="45" height="35" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M5 25C2.5 25 1 23.5 1 20.5C1 17.5 3 16 5 16C5 13 7 10 10 10C13 10 15 12 16 14C17 12 19 11 21 11C24 11 26 13 26 16C28 16 30 18 30 21C30 24 28 25 26 25C25.5 25 5.5 25 5 25Z" 
              fill="#777777" 
              fillOpacity="0.85"
            />
            <text x="12" y="20" fontSize="11" fill="#444">~</text>
          </svg>
        </div>
      )}
      
      {/* Rainbow effect for clean unicorn - positioned to not cover horn */}
      {isClean && (
        <div 
          className={`absolute top-[-20px] right-[-40px] transform transition-opacity duration-1000 ease-in-out ${sparkle ? 'opacity-95' : 'opacity-80'}`}
          style={{ 
            transform: "scale(1.2)",
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.7))",
            zIndex: -1 // Place behind unicorn
          }}
        >
          <svg width="140" height="70" viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M10 70C10 40 40 10 70 10C100 10 130 40 130 70" 
              stroke="#FF0000" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path 
              d="M20 70C20 45 45 20 70 20C95 20 120 45 120 70" 
              stroke="#FF9900" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path 
              d="M30 70C30 50 50 30 70 30C90 30 110 50 110 70" 
              stroke="#FFFF00" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path 
              d="M40 70C40 55 55 40 70 40C85 40 100 55 100 70" 
              stroke="#33CC33" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path 
              d="M50 70C50 60 60 50 70 50C80 50 90 60 90 70" 
              stroke="#3399FF" 
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path 
              d="M60 70C60 65 65 60 70 60C75 60 80 65 80 70" 
              stroke="#9966FF" 
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      
      {/* Tears for very dirty unicorn (days 6-7) */}
      {!isClean && dirtiness >= 6 && isCrying && (
        <>
          {/* Left tear - bigger for dirtiness 7 */}
          <div className="absolute left-[185px] top-[115px] animate-drip">
            <svg 
              width={dirtiness >= 7 ? "20" : "15"} 
              height={dirtiness >= 7 ? "35" : "25"} 
              viewBox="0 0 15 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: dirtiness >= 7 ? "scale(1.4)" : "scale(1)" }}
            >
              <path
                d="M7.5 0C7.5 0 0 15 0 20C0 22.7614 3.35786 25 7.5 25C11.6421 25 15 22.7614 15 20C15 15 7.5 0 7.5 0Z"
                fill="#89CFF0"
                fillOpacity={dirtiness >= 7 ? "0.9" : "0.8"}
              />
            </svg>
          </div>
          
          {/* Right tear - bigger for dirtiness 7 */}
          <div className="absolute left-[210px] top-[115px] animate-drip-delayed">
            <svg 
              width={dirtiness >= 7 ? "20" : "15"} 
              height={dirtiness >= 7 ? "35" : "25"} 
              viewBox="0 0 15 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: dirtiness >= 7 ? "scale(1.4)" : "scale(1)" }}
            >
              <path
                d="M7.5 0C7.5 0 0 15 0 20C0 22.7614 3.35786 25 7.5 25C11.6421 25 15 22.7614 15 20C15 15 7.5 0 7.5 0Z"
                fill="#89CFF0"
                fillOpacity={dirtiness >= 7 ? "0.9" : "0.8"}
              />
            </svg>
          </div>
          
          {/* Extra tears for extremely dirty unicorn (day 7) */}
          {dirtiness >= 7 && (
            <>
              <div className="absolute left-[198px] top-[113px] animate-drip" style={{ animationDelay: "300ms" }}>
                <svg width="12" height="20" viewBox="0 0 15 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.5 0C7.5 0 0 15 0 20C0 22.7614 3.35786 25 7.5 25C11.6421 25 15 22.7614 15 20C15 15 7.5 0 7.5 0Z"
                    fill="#89CFF0"
                    fillOpacity="0.85"
                  />
                </svg>
              </div>
              
              <div className="absolute left-[175px] top-[115px] animate-drip-delayed" style={{ animationDelay: "600ms" }}>
                <svg width="10" height="18" viewBox="0 0 15 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.5 0C7.5 0 0 15 0 20C0 22.7614 3.35786 25 7.5 25C11.6421 25 15 22.7614 15 20C15 15 7.5 0 7.5 0Z"
                    fill="#89CFF0"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>
            </>
          )}
        </>
      )}

      {/* Sparkles for clean unicorn */}
      {isClean && (
        <>
          <div className={`absolute top-8 right-16 transform transition-all duration-500 ease-in-out ${
            sparkle ? 'opacity-90 scale-110' : 'opacity-40 scale-90'
          }`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" fill="#FFD700"/>
            </svg>
          </div>
          <div className={`absolute top-20 left-14 transform transition-all duration-500 ease-in-out ${
            !sparkle ? 'opacity-90 scale-110' : 'opacity-40 scale-90'
          }`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" fill="#FFD700"/>
            </svg>
          </div>
          <div className={`absolute bottom-14 right-20 transform transition-all duration-600 ease-in-out ${
            sparkle ? 'opacity-70 scale-105' : 'opacity-50 scale-95'
          }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" fill="#FFD700"/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
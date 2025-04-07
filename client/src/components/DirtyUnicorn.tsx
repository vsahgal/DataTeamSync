import React, { useEffect, useState, useRef } from 'react';

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
  
  // Handle regular animations like sparkles and smell clouds
  useEffect(() => {
    if (isClean) {
      // Sparkle animation for clean unicorn
      const sparkleInterval = setInterval(() => {
        setSparkle(prev => !prev);
      }, 1500);
      
      return () => {
        clearInterval(sparkleInterval);
      };
    } else {
      // First smell cloud animation
      const smell1Interval = setInterval(() => {
        setShowSmell1(prev => !prev);
      }, 2000);
      
      // Second smell cloud animation (offset timing)
      const smell2Interval = setInterval(() => {
        setShowSmell2(prev => !prev);
      }, 3000);
      
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
        clearInterval(smell2Interval);
        if (smell3Interval) clearInterval(smell3Interval);
        clearInterval(sighInterval);
        if (cryingInterval) clearInterval(cryingInterval);
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
      {isClean ? (
        // Clean unicorn SVG
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
            className="transition-all duration-300 ease-in-out"
          />
          
          <path d="M205 90 L220 60" stroke="#FFB6D9" strokeWidth="8" strokeLinecap="round"/>
          <ellipse cx="160" cy="120" rx="12" ry="20" fill="#FFB6D9" />
          <ellipse cx="145" cy="120" rx="12" ry="20" fill="#B5DEFF"/>
          <ellipse cx="130" cy="120" rx="12" ry="20" fill="#D9B5FF"/>
          <ellipse cx="115" cy="120" rx="12" ry="20" fill="#B5FFD9"/>
          <ellipse cx="100" cy="120" rx="12" ry="20" fill="#FFB6D9"/>
          <path d="M70 160 Q50 120 70 80" stroke="#FFB6D9" strokeWidth="10" strokeLinecap="round" fill="none"/>
        </svg>
      ) : (
        // Dirty unicorn SVG
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="150" cy="160" rx="80" ry="60" fill="#EECEE7"/>
          
          {/* Dirt spots on body - dynamically scaled with dirtiness */}
          <circle cx="130" cy="140" r={16 + Math.min(4, dirtiness) * 3} fill="#A67F75" fillOpacity={dirtOpacity} />
          <circle cx="170" cy="180" r={13 + Math.min(5, dirtiness) * 3} fill="#A67F75" fillOpacity={dirtOpacity - 0.05} />
          <circle cx="100" cy="170" r={10 + Math.min(6, dirtiness) * 3} fill="#A67F75" fillOpacity={dirtOpacity - 0.1} />
          
          {/* Extra dirt spots for very dirty unicorns */}
          {dirtiness >= 4 && (
            <>
              <circle cx="150" cy="150" r={10 + (dirtiness - 4) * 6} fill="#A67F75" fillOpacity={dirtOpacity} />
              <circle cx="190" cy="150" r={8 + (dirtiness - 4) * 6} fill="#A67F75" fillOpacity={dirtOpacity - 0.1} />
            </>
          )}
          
          {/* Even more dirt spots for extremely dirty unicorns (days 5-7) */}
          {dirtiness >= 5 && (
            <>
              <circle cx="140" cy="160" r={7 + (dirtiness - 5) * 8} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
              <circle cx="180" cy="140" r={6 + (dirtiness - 5) * 8} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
              <circle cx="110" cy="150" r={8 + (dirtiness - 5) * 6} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
              <circle cx="165" cy="170" r={7 + (dirtiness - 5) * 6} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
              
              {/* Additional dirt spots for extremely dirty unicorn */}
              <circle cx="120" cy="180" r={9 + (dirtiness - 5) * 5} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
              <circle cx="160" cy="175" r={8 + (dirtiness - 5) * 5} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
            </>
          )}
          
          <rect x="90" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
          {/* Dirt on legs - dramatically increased with dirtiness */}
          <circle cx="97" cy="220" r={8 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
          <rect x="120" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
          <circle cx="127" cy="230" r={9 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity - 0.05} />
          <rect x="165" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
          <circle cx="172" cy="240" r={8 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
          <rect x="195" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
          <circle cx="202" cy="225" r={8 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity - 0.05} />
          
          <ellipse cx="200" cy="120" rx="40" ry="30" fill="#EECEE7"/>
          {/* Dirt on face - dramatically scaled with dirtiness */}
          <circle cx="180" cy="110" r={8 + Math.min(4, dirtiness) * 3} fill="#896058" fillOpacity={dirtOpacity} />
          {dirtiness >= 5 && (
            <>
              <circle cx="195" cy="105" r={7 + (dirtiness - 5) * 3} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
              <circle cx="190" cy="130" r={6 + (dirtiness - 5) * 2} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
            </>
          )}

          {/* Eye appearance changes with dirtiness */}
          <circle cx="210" cy="110" r="5" fill={dirtiness >= 6 ? "#f0f0f0" : "white"} />
          <circle cx="210" cy="110" r="2" fill="#333" />

          {/* Sad eyes - gets even sadder with dirtiness */}
          <path 
            d={sigh 
               ? "M190 135 Q205 125 220 135" 
               : dirtiness >= 6 
                 ? `M185 ${132 + dirtiness} Q205 ${118 + dirtiness * 1.5} 225 ${132 + dirtiness}`
                 : `M190 ${130 + dirtiness} Q205 ${120 + dirtiness} 220 ${130 + dirtiness}`
              } 
            stroke="#333" 
            strokeWidth="2" 
            fill="none"
            className="transition-all duration-300 ease-in-out"
          />
          
          <path d="M205 90 L220 60" stroke="#FFB6D9" strokeWidth="8" strokeLinecap="round"/>
          <ellipse cx="160" cy="120" rx="12" ry="20" fill="#FFB6D9" />
          {/* Dirt on horn - dramatically increased */}
          <circle cx="160" cy="110" r={5 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
          <ellipse cx="145" cy="120" rx="12" ry="20" fill="#B5DEFF"/>
          <circle cx="145" cy="110" r={4 + Math.min(3, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity - 0.05} />
          <ellipse cx="130" cy="120" rx="12" ry="20" fill="#D9B5FF"/>
          <circle cx="130" cy="110" r={6 + Math.min(3, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
          <ellipse cx="115" cy="120" rx="12" ry="20" fill="#B5FFD9"/>
          <circle cx="115" cy="115" r={5 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
          <ellipse cx="100" cy="120" rx="12" ry="20" fill="#FFB6D9"/>
          <circle cx="100" cy="110" r={4 + Math.min(4, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
          <path d="M70 160 Q50 120 70 80" stroke="#FFB6D9" strokeWidth="10" strokeLinecap="round" fill="none"/>
          <circle cx="60" cy="130" r={8 + Math.min(5, dirtiness) * 2} fill="#896058" fillOpacity={dirtOpacity} />
          
          {/* Extra dirt spots for extremely dirty unicorn tail (days 6-7) */}
          {dirtiness >= 6 && (
            <>
              <circle cx="65" cy="100" r={10 + (dirtiness - 6) * 4} fill="#896058" fillOpacity={dirtOpacity + 0.15} />
              <circle cx="75" cy="120" r={8 + (dirtiness - 6) * 3} fill="#896058" fillOpacity={dirtOpacity + 0.1} />
            </>
          )}
        </svg>
      )}
      
      {/* Smell cloud 1 - gets bigger and darker with dirtiness */}
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
      
      {/* Smell cloud 2 - gets bigger and darker with dirtiness */}
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
      
      {/* Smell cloud 3 - only appears for very dirty unicorn (level 5+), gets bigger for day 7 */}
      {dirtiness >= 5 && (
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
      {dirtiness >= 7 && (
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
      
      {/* Tears for very dirty unicorn (days 6-7) */}
      {dirtiness >= 6 && isCrying && (
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
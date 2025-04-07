import React, { useEffect, useState } from 'react';

interface DirtyUnicornProps {
  dirtiness: number; // Scale of 0-7, where 0 is clean and 7 is the dirtiest
}

export default function DirtyUnicorn({ dirtiness = 3 }: DirtyUnicornProps) {
  const [showSmell1, setShowSmell1] = useState(false);
  const [showSmell2, setShowSmell2] = useState(false);
  const [showSmell3, setShowSmell3] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [sigh, setSigh] = useState(false);
  
  // Only show dirt when dirtiness is greater than 0
  const isClean = dirtiness === 0;
  
  // Adjust opacity of dirt spots based on dirtiness level (1-7)
  const baseOpacity = 0.4;
  const dirtOpacity = baseOpacity + (dirtiness * 0.08); // Increases with dirtiness
  
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
      }, dirtiness >= 5 ? 2500 : 4000);
      
      return () => {
        clearInterval(smell1Interval);
        clearInterval(smell2Interval);
        if (smell3Interval) clearInterval(smell3Interval);
        clearInterval(sighInterval);
      };
    }
  }, [dirtiness, isClean]);
  
  return (
    <div className="relative w-54 h-54 mx-auto">
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
          <circle cx="130" cy="140" r={16 + Math.min(4, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity} />
          <circle cx="170" cy="180" r={13 + Math.min(5, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity - 0.05} />
          <circle cx="100" cy="170" r={10 + Math.min(6, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity - 0.1} />
          
          {/* Extra dirt spots for very dirty unicorns */}
          {dirtiness >= 4 && (
            <>
              <circle cx="150" cy="150" r={10 + (dirtiness - 4) * 2} fill="#D8BAB5" fillOpacity={dirtOpacity} />
              <circle cx="190" cy="150" r={8 + (dirtiness - 4) * 2} fill="#D8BAB5" fillOpacity={dirtOpacity - 0.1} />
            </>
          )}
          
          <rect x="90" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
          {/* Dirt on legs */}
          <circle cx="97" cy="220" r="8" fill="#D8BAB5" fillOpacity={dirtOpacity} />
          <rect x="120" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
          <circle cx="127" cy="230" r="9" fill="#D8BAB5" fillOpacity={dirtOpacity - 0.05} />
          <rect x="165" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
          <circle cx="172" cy="240" r="8" fill="#D8BAB5" fillOpacity={dirtOpacity} />
          <rect x="195" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
          <circle cx="202" cy="225" r="8" fill="#D8BAB5" fillOpacity={dirtOpacity - 0.05} />
          
          <ellipse cx="200" cy="120" rx="40" ry="30" fill="#EECEE7"/>
          {/* Dirt on face - more dirt when dirtier */}
          <circle cx="180" cy="110" r={8 + Math.min(4, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity} />
          
          {/* Eye appearance changes with dirtiness */}
          <circle cx="210" cy="110" r="5" fill={dirtiness >= 6 ? "#f8f8f8" : "white"} />
          <circle cx="210" cy="110" r="2" fill="#333" />

          {/* Sad eyes */}
          <path 
            d={sigh ? "M190 135 Q205 125 220 135" : `M190 ${130 + dirtiness} Q205 ${120 + dirtiness} 220 ${130 + dirtiness}`} 
            stroke="#333" 
            strokeWidth="2" 
            fill="none"
            className="transition-all duration-300 ease-in-out"
          />
          
          <path d="M205 90 L220 60" stroke="#FFB6D9" strokeWidth="8" strokeLinecap="round"/>
          <ellipse cx="160" cy="120" rx="12" ry="20" fill="#FFB6D9" />
          {/* Dirt on horn */}
          <circle cx="160" cy="110" r={5 + Math.min(4, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity} />
          <ellipse cx="145" cy="120" rx="12" ry="20" fill="#B5DEFF"/>
          <circle cx="145" cy="110" r={4 + Math.min(3, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity - 0.05} />
          <ellipse cx="130" cy="120" rx="12" ry="20" fill="#D9B5FF"/>
          <circle cx="130" cy="110" r={6 + Math.min(3, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity} />
          <ellipse cx="115" cy="120" rx="12" ry="20" fill="#B5FFD9"/>
          <circle cx="115" cy="115" r={5 + Math.min(4, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity + 0.1} />
          <ellipse cx="100" cy="120" rx="12" ry="20" fill="#FFB6D9"/>
          <circle cx="100" cy="110" r={4 + Math.min(4, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity} />
          <path d="M70 160 Q50 120 70 80" stroke="#FFB6D9" strokeWidth="10" strokeLinecap="round" fill="none"/>
          <circle cx="60" cy="130" r={8 + Math.min(5, dirtiness)} fill="#D8BAB5" fillOpacity={dirtOpacity} />
        </svg>
      )}
      
      {/* Smell cloud 1 */}
      <div 
        className={`absolute top-10 right-8 transform transition-all duration-700 ease-in-out ${
          showSmell1 ? 'opacity-80 translate-y-[-10px]' : 'opacity-0 translate-y-0'
        }`}
      >
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 25C2.5 25 1 23.5 1 20.5C1 17.5 3 16 5 16C5 13 7 10 10 10C13 10 15 12 16 14C17 12 19 11 21 11C24 11 26 13 26 16C28 16 30 18 30 21C30 24 28 25 26 25C25.5 25 5.5 25 5 25Z" fill="#AAAAAA" fillOpacity="0.6"/>
          <text x="15" y="20" fontSize="8" fill="#555">~</text>
        </svg>
      </div>
      
      {/* Smell cloud 2 */}
      <div 
        className={`absolute top-5 left-10 transform transition-all duration-700 ease-in-out ${
          showSmell2 ? 'opacity-80 translate-y-[-8px]' : 'opacity-0 translate-y-0'
        }`}
      >
        <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 20C1.5 20 1 18.5 1 16.5C1 14.5 2 13 3.5 13C3.5 11 5 8 7.5 8C10 8 11.5 10 12 11.5C12.5 10 14 9 15.5 9C17.5 9 19 10.5 19 13C20.5 13 22 14.5 22 17C22 19.5 20.5 20 19 20C18.5 20 3.5 20 3 20Z" fill="#AAAAAA" fillOpacity="0.6"/>
          <text x="11" y="16" fontSize="6" fill="#555">~</text>
        </svg>
      </div>
      
      {/* Smell cloud 3 - only appears for very dirty unicorn (level 5+) */}
      {dirtiness >= 5 && (
        <div 
          className={`absolute top-12 left-32 transform transition-all duration-700 ease-in-out ${
            showSmell3 ? 'opacity-80 translate-y-[-12px]' : 'opacity-0 translate-y-0'
          }`}
        >
          <svg width="35" height="28" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 22C2 22 1 20 1 17.5C1 15 2.5 13.5 4.5 13.5C4.5 11 6.5 7.5 9.5 7.5C12.5 7.5 14.5 10 15 12C16 10 18 9 20 9C23 9 25 11 25 14C27 14 29 16 29 19C29 22 27 22.5 25 22.5C24.5 22.5 4.5 22 4 22Z" fill="#AAAAAA" fillOpacity="0.7"/>
            <text x="13" y="17" fontSize="7" fill="#555">~</text>
          </svg>
        </div>
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
import React, { useEffect, useState } from 'react';

export default function DirtyUnicorn() {
  const [showSmell1, setShowSmell1] = useState(false);
  const [showSmell2, setShowSmell2] = useState(false);
  const [sigh, setSigh] = useState(false);
  
  useEffect(() => {
    // First smell cloud animation
    const smell1Interval = setInterval(() => {
      setShowSmell1(prev => !prev);
    }, 2000);
    
    // Second smell cloud animation (offset timing)
    const smell2Interval = setInterval(() => {
      setShowSmell2(prev => !prev);
    }, 3000);
    
    // Sighing animation
    const sighInterval = setInterval(() => {
      setSigh(true);
      setTimeout(() => setSigh(false), 500);
    }, 4000);
    
    return () => {
      clearInterval(smell1Interval);
      clearInterval(smell2Interval);
      clearInterval(sighInterval);
    };
  }, []);
  
  return (
    <div className="relative w-54 h-54 mx-auto">
      {/* The base dirty unicorn SVG */}
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="150" cy="160" rx="80" ry="60" fill="#EECEE7"/>
        {/* Dirt spots on body */}
        <circle cx="130" cy="140" r="18" fill="#D8BAB5" fillOpacity="0.8" />
        <circle cx="170" cy="180" r="15" fill="#D8BAB5" fillOpacity="0.7" />
        <circle cx="100" cy="170" r="12" fill="#D8BAB5" fillOpacity="0.5" />
        <rect x="90" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
        {/* Dirt on legs */}
        <circle cx="97" cy="220" r="8" fill="#D8BAB5" fillOpacity="0.7" />
        <rect x="120" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
        <circle cx="127" cy="230" r="9" fill="#D8BAB5" fillOpacity="0.6" />
        <rect x="165" y="200" width="15" height="55" rx="7" fill="#EECEE7" />
        <circle cx="172" cy="240" r="8" fill="#D8BAB5" fillOpacity="0.7" />
        <rect x="195" y="200" width="15" height="50" rx="7" fill="#EECEE7" />
        <circle cx="202" cy="225" r="8" fill="#D8BAB5" fillOpacity="0.6" />
        <ellipse cx="200" cy="120" rx="40" ry="30" fill="#EECEE7"/>
        {/* Dirt on face */}
        <circle cx="180" cy="110" r="10" fill="#D8BAB5" fillOpacity="0.6" />
        <circle cx="210" cy="110" r="5" fill="white" />
        <circle cx="210" cy="110" r="2" fill="#333" />

        {/* Sad eyes */}
        <path 
          d={sigh ? "M190 135 Q205 125 220 135" : "M190 130 Q205 120 220 130"} 
          stroke="#333" 
          strokeWidth="2" 
          fill="none"
          className="transition-all duration-300 ease-in-out"
        />
        
        <path d="M205 90 L220 60" stroke="#FFB6D9" strokeWidth="8" strokeLinecap="round"/>
        <ellipse cx="160" cy="120" rx="12" ry="20" fill="#FFB6D9" />
        {/* Dirt on horn */}
        <circle cx="160" cy="110" r="7" fill="#D8BAB5" fillOpacity="0.7" />
        <ellipse cx="145" cy="120" rx="12" ry="20" fill="#B5DEFF"/>
        <circle cx="145" cy="110" r="6" fill="#D8BAB5" fillOpacity="0.6" />
        <ellipse cx="130" cy="120" rx="12" ry="20" fill="#D9B5FF"/>
        <circle cx="130" cy="110" r="8" fill="#D8BAB5" fillOpacity="0.7" />
        <ellipse cx="115" cy="120" rx="12" ry="20" fill="#B5FFD9"/>
        <circle cx="115" cy="115" r="7" fill="#D8BAB5" fillOpacity="0.8" />
        <ellipse cx="100" cy="120" rx="12" ry="20" fill="#FFB6D9"/>
        <circle cx="100" cy="110" r="6" fill="#D8BAB5" fillOpacity="0.7" />
        <path d="M70 160 Q50 120 70 80" stroke="#FFB6D9" strokeWidth="10" strokeLinecap="round" fill="none"/>
        <circle cx="60" cy="130" r="10" fill="#D8BAB5" fillOpacity="0.7" />
      </svg>
      
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
    </div>
  );
}
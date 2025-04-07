import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface UnicornShowerProps {
  isShowering: boolean;
  elapsedTime: number;
  isActive: boolean;
  onStopShower: () => void;
}

export default function UnicornShower({ isShowering, elapsedTime, isActive, onStopShower }: UnicornShowerProps) {
  const [showingSoap, setShowingSoap] = useState(false);
  const [showingRinse, setShowingRinse] = useState(false);
  
  // Format time as MM:SS
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Handle soap and rinse animations based on elapsed time
  useEffect(() => {
    if (isShowering) {
      // Show soap after 5 seconds
      const soapTimer = setTimeout(() => {
        setShowingSoap(true);
      }, 5000);
      
      // Show rinse after 15 seconds
      const rinseTimer = setTimeout(() => {
        setShowingSoap(false);
        setShowingRinse(true);
      }, 15000);
      
      return () => {
        clearTimeout(soapTimer);
        clearTimeout(rinseTimer);
      };
    } else {
      setShowingSoap(false);
      setShowingRinse(false);
    }
  }, [isShowering, elapsedTime]);
  
  if (!isShowering) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-50">
      {/* Timer at the top */}
      <div className="absolute top-4 left-0 right-0 z-50">
        <div className="mx-auto w-40 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg text-center">
          <p className="text-3xl font-bold text-blue-600 font-mono">
            {formattedTime}
          </p>
        </div>
      </div>
      
      {/* Water drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-2 h-6 bg-blue-400 rounded-full opacity-70"
            initial={{ 
              top: "-5%", 
              left: `${Math.random() * 100}%` 
            }}
            animate={{ 
              top: "100%",
              opacity: [0.8, 0.7, 0]
            }}
            transition={{ 
              duration: 1.5 + Math.random() * 0.8, 
              repeat: Infinity, 
              delay: Math.random() * 2,
              ease: "easeIn"
            }}
          />
        ))}
      </div>
      
      {/* Shower head */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="w-20 h-5 bg-gray-300 rounded-b-lg" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gray-400 rounded-b-lg flex justify-around items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={i}
                className="w-1 h-1 bg-blue-200 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Unicorn */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Unicorn Body */}
          <motion.ellipse 
            cx="150" 
            cy="160" 
            rx="80" 
            ry="60" 
            fill="#FFD6F6"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Legs */}
          <rect x="90" y="200" width="15" height="50" rx="7" fill="#FFD6F6" />
          <rect x="120" y="200" width="15" height="55" rx="7" fill="#FFD6F6" />
          <rect x="165" y="200" width="15" height="55" rx="7" fill="#FFD6F6" />
          <rect x="195" y="200" width="15" height="50" rx="7" fill="#FFD6F6" />
          
          {/* Head */}
          <motion.ellipse 
            cx="200" 
            cy="120" 
            rx="40" 
            ry="30" 
            fill="#FFD6F6"
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
          
          {/* Eyes */}
          <circle cx="210" cy="110" r="5" fill="white" />
          <circle cx="210" cy="110" r="2" fill="#333" />
          
          {/* Smile */}
          <motion.path 
            d="M190 125 Q205 135 220 125" 
            stroke="#333" 
            strokeWidth="2" 
            fill="none"
            animate={showingRinse ? { d: "M190 130 Q205 140 220 130" } : {}}
            transition={{ duration: 0.5 }}
          />
          
          {/* Horn */}
          <motion.path 
            d="M205 90 L220 60" 
            stroke="#FFB6D9" 
            strokeWidth="8" 
            strokeLinecap="round"
            animate={{ 
              stroke: ["#FFB6D9", "#FFD6F6", "#FFB6D9"] 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Mane */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.ellipse
              key={i}
              cx={160 - i * 15}
              cy={120 + Math.sin(i) * 10}
              rx="12"
              ry="20"
              fill={["#FFB6D9", "#B5DEFF", "#D9B5FF", "#B5FFD9"][i % 4]}
              animate={{ 
                y: [0, Math.sin(i) * 8, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.1
              }}
            />
          ))}
          
          {/* Tail */}
          <motion.path 
            d="M70 160 Q50 120 70 80" 
            stroke="#FFB6D9" 
            strokeWidth="10" 
            strokeLinecap="round"
            fill="none"
            animate={{ 
              d: ["M70 160 Q50 120 70 80", "M70 160 Q40 120 60 80", "M70 160 Q50 120 70 80"] 
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
          
          {/* Soap bubbles - only show when soaping */}
          {showingSoap && (
            <>
              <motion.circle 
                cx="120" 
                cy="140" 
                r="15" 
                fill="white" 
                fillOpacity="0.8"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.circle 
                cx="160" 
                cy="170" 
                r="20" 
                fill="white" 
                fillOpacity="0.8"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.3
                }}
              />
              <motion.circle 
                cx="180" 
                cy="130" 
                r="12" 
                fill="white" 
                fillOpacity="0.8"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.6
                }}
              />
            </>
          )}
          
          {/* Rinse water streams - only show when rinsing */}
          {showingRinse && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.path
                  key={i}
                  d={`M${100 + i * 20} ${130 + (i % 3) * 10} Q${95 + i * 20} ${150 + (i % 3) * 10} ${90 + i * 20} ${170 + (i % 3) * 10}`}
                  stroke="#B5DEFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    pathLength: [0, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </>
          )}
        </svg>
      </motion.div>
      
      {/* Water splash at bottom */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <div className="relative">
          <motion.div
            className="absolute bottom-0 w-60 h-10 rounded-full bg-blue-200 opacity-70"
            animate={{
              scaleX: [1, 1.2, 1],
              scaleY: [1, 0.8, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-6 bg-blue-300 rounded-full"
              initial={{ 
                bottom: 0,
                left: 20 + i * 15,
                opacity: 0.7 
              }}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Done Showering Button */}
      <div className="absolute top-20 right-6 z-50">
        <motion.button
          onClick={onStopShower}
          className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-3 px-6 rounded-full shadow-lg border-4 border-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          Done Showering!
        </motion.button>
      </div>
      
      {/* Status message */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.div
          className="inline-block bg-white/80 backdrop-blur-sm py-2 px-6 rounded-full shadow-lg"
          animate={{
            y: [0, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <p className="text-lg font-medium">
            {showingSoap ? "Scrub-a-dub-dub! 🧼" : showingRinse ? "Rinse time! 💦" : "Shower time! 🚿"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
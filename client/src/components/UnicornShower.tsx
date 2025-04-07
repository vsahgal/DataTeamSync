import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getShowerStats } from "@/lib/storage";

interface UnicornShowerProps {
  isShowering: boolean;
  elapsedTime: number;
  isActive: boolean;
  onStopShower: () => void;
}

export default function UnicornShower({ isShowering, elapsedTime, isActive, onStopShower }: UnicornShowerProps) {
  // Force dirty state at the beginning of the shower
  const [showingSoap, setShowingSoap] = useState(false);
  const [showingRinse, setShowingRinse] = useState(false);
  const [cleaningStage, setCleaningStage] = useState(0); // 0: dirty, 1: getting clean, 2: almost clean, 3: sparkling clean
  const [waterFlowing, setWaterFlowing] = useState(false);
  const [unicornJumping, setUnicornJumping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Get the current dirtiness level from stats
  const stats = getShowerStats();
  const getDaysSinceLastShower = (dateString: string) => {
    const lastShowerDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - lastShowerDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate initial dirtiness (0-7)
  const initialDirtiness = stats.lastShowerDate ? 
    (getDaysSinceLastShower(stats.lastShowerDate) === 0 ? 0 : Math.min(7, getDaysSinceLastShower(stats.lastShowerDate))) : 
    3;
  
  // Format time as MM:SS
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Initialize the unicorn with the proper dirt level on first render
  useEffect(() => {
    if (isShowering && !initialized) {
      // Start with the unicorn in its dirty state
      setCleaningStage(0);
      setWaterFlowing(false);
      setShowingSoap(false);
      setShowingRinse(false);
      setInitialized(true);
      
      console.log("Initial dirt level:", initialDirtiness);
    }
  }, [isShowering, initialized, initialDirtiness]);

  // Progressive cleaning animation that depends on elapsed time
  useEffect(() => {
    if (isShowering) {
      // Start with water flowing animation after a delay
      const waterStartTimer = setTimeout(() => {
        setWaterFlowing(true);
      }, 1000);
      
      // Initial cleaning begins
      const stage1Timer = setTimeout(() => {
        setCleaningStage(1);
      }, 5000);
      
      // Show soap and continue cleaning
      const soapTimer = setTimeout(() => {
        setShowingSoap(true);
        
        // Make unicorn do a little jump of happiness
        setUnicornJumping(true);
        setTimeout(() => setUnicornJumping(false), 1500);
      }, 8000);
      
      // Getting cleaner
      const stage2Timer = setTimeout(() => {
        setCleaningStage(2);
        
        // Another little jump
        setUnicornJumping(true);
        setTimeout(() => setUnicornJumping(false), 1500);
      }, 12000);
      
      // Show rinse and final cleaning stage
      const rinseTimer = setTimeout(() => {
        setShowingSoap(false);
        setShowingRinse(true);
        setCleaningStage(3);
        
        // Final excited jump
        setUnicornJumping(true);
        setTimeout(() => setUnicornJumping(false), 1500);
      }, 15000);
      
      return () => {
        clearTimeout(waterStartTimer);
        clearTimeout(stage1Timer);
        clearTimeout(soapTimer);
        clearTimeout(stage2Timer);
        clearTimeout(rinseTimer);
      };
    } else {
      setShowingSoap(false);
      setShowingRinse(false);
      setWaterFlowing(false);
    }
  }, [isShowering]);
  
  if (!isShowering) return null;
  
  // Calculate dirt spots based on initial dirtiness and current cleaning stage
  const calculateDirtSpots = () => {
    // Use a minimum of 3 dirt spots if the unicorn is dirty to make it more visible
    const baseSpots = Math.max(3, initialDirtiness);
    
    // Scale up dirt spots for better visibility (3x as many dirt spots as days since shower)
    const scaledBaseSpots = baseSpots * 3;
    
    // Reduce dirt spots as cleaning progresses
    const reduction = cleaningStage * (scaledBaseSpots / 3); // Full cleaning (stage 3) removes all dirt
    const currentSpots = Math.max(0, Math.floor(scaledBaseSpots - reduction));
    
    return currentSpots;
  };
  
  // Generate dirt spots for the unicorn
  const generateDirtSpots = () => {
    const spots = [];
    const totalSpots = calculateDirtSpots();
    
    for (let i = 0; i < totalSpots; i++) {
      // Seed random positions based on spot index for consistency
      const randomXOffset = Math.sin(i * 1.5) * 40 + 150;
      const randomYOffset = Math.cos(i * 1.5) * 30 + 160;
      
      spots.push(
        <motion.circle
          key={`dirt-${i}`}
          cx={randomXOffset}
          cy={randomYOffset}
          r={5 + (i % 3)}
          fill="#a5815b"
          opacity={0.7 - (cleaningStage * 0.2)}
          animate={{
            opacity: [0.7 - (cleaningStage * 0.2), 0.4 - (cleaningStage * 0.1), 0.7 - (cleaningStage * 0.2)],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2
          }}
        />
      );
    }
    return spots;
  };
  
  // Generate sparkles for clean unicorn
  const generateSparkles = () => {
    if (cleaningStage < 2) return null;
    
    const sparkles = [];
    const sparkleCount = cleaningStage === 2 ? 5 : 10;
    
    for (let i = 0; i < sparkleCount; i++) {
      // Position sparkles all around the unicorn
      const angle = (i / sparkleCount) * Math.PI * 2;
      const distance = 70 + (i % 3) * 20;
      const x = Math.cos(angle) * distance + 150;
      const y = Math.sin(angle) * distance + 150;
      
      sparkles.push(
        <motion.path
          key={`sparkle-${i}`}
          d="M0 -4L1 -1L4 0L1 1L0 4L-1 1L-4 0L-1 -1Z"
          fill="#FFD700"
          transform={`translate(${x}, ${y})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.9, 0],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            repeatDelay: 1
          }}
        />
      );
    }
    return sparkles;
  };
  
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
      
      {/* Water drops - only shown when water is flowing */}
      <AnimatePresence>
        {waterFlowing && (
          <motion.div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-6 bg-blue-400 rounded-full opacity-70"
                initial={{ 
                  top: "-5%", 
                  left: `${Math.random() * 100}%`,
                  opacity: 0
                }}
                animate={{ 
                  top: "100%",
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 1.5 + Math.random() * 0.8, 
                  repeat: Infinity, 
                  delay: Math.random() * 2,
                  ease: "easeIn"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Shower head with water startup animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          <div className="w-20 h-5 bg-gray-300 rounded-b-lg" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-gray-400 rounded-b-lg flex justify-around items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={i}
                className="w-1 h-1 bg-blue-200 rounded-full"
                animate={{ 
                  opacity: waterFlowing ? [0.5, 1, 0.5] : 0 
                }}
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
      
      {/* Unicorn with cleaning animation */}
      <motion.div
        className="relative z-10"
        animate={{ 
          y: unicornJumping 
              ? [0, -30, -20, -25, 0] // big jump when cleaning happens
              : waterFlowing 
                ? [0, -5, 0] // gentle float when showering
                : 0 // static when water not flowing
        }}
        transition={{
          duration: unicornJumping ? 1 : 2,
          repeat: unicornJumping ? 0 : Infinity,
          repeatType: "reverse",
          ease: unicornJumping ? "easeOut" : "easeInOut"
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
          
          {/* Dirt spots that gradually disappear during cleaning */}
          {generateDirtSpots()}
          
          {/* Sparkles that appear when clean */}
          {generateSparkles()}
          
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
          
          {/* Eyes - more excited as cleaning progresses */}
          <circle cx="210" cy="110" r={5 + (cleaningStage * 0.5)} fill="white" />
          <circle cx="210" cy="110" r={2 + (cleaningStage * 0.3)} fill="#333" />
          
          {/* Smile - gets bigger as cleaning progresses */}
          <motion.path 
            d={
              cleaningStage === 0 
                ? "M190 125 Q205 130 220 125" // neutral
                : cleaningStage === 1 
                ? "M190 125 Q205 135 220 125" // small smile
                : cleaningStage === 2
                ? "M190 128 Q205 140 220 128" // bigger smile
                : "M190 130 Q205 145 220 130" // biggest smile
            }
            stroke="#333" 
            strokeWidth="2" 
            fill="none"
          />
          
          {/* Horn */}
          <motion.path 
            d="M205 90 L220 60" 
            stroke={cleaningStage >= 2 ? "#FFB6D9" : "#e2a3c7"}
            strokeWidth="8" 
            strokeLinecap="round"
            animate={{ 
              stroke: cleaningStage >= 2 
                ? ["#FFB6D9", "#FFD6F6", "#FFB6D9"] 
                : ["#e2a3c7", "#d589b8", "#e2a3c7"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Mane - gets more vibrant as cleaning progresses */}
          {Array.from({ length: 8 }).map((_, i) => {
            // Adjust colors based on cleaning stage
            const colorOptions = [
              ["#d898bc", "#a5b6d2", "#bca5d2", "#a5d2b6"], // Duller colors when dirty
              ["#e6a6ca", "#b5c9e6", "#c6b5e6", "#b5e6c9"], // Slightly brighter
              ["#f7b3d9", "#c2d6f7", "#d3c2f7", "#c2f7d6"], // Even brighter
              ["#FFB6D9", "#B5DEFF", "#D9B5FF", "#B5FFD9"]  // Brightest when clean
            ];
            
            const currentColors = colorOptions[cleaningStage];
            
            return (
              <motion.ellipse
                key={i}
                cx={160 - i * 15}
                cy={120 + Math.sin(i) * 10}
                rx="12"
                ry="20"
                fill={currentColors[i % 4]}
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
            );
          })}
          
          {/* Tail */}
          <motion.path 
            d="M70 160 Q50 120 70 80" 
            stroke={cleaningStage >= 2 ? "#FFB6D9" : "#e2a3c7"}
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
      
      {/* Water splash at bottom - only when water is flowing */}
      <AnimatePresence>
        {waterFlowing && (
          <motion.div 
            className="absolute bottom-10 left-0 w-full flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
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
                    opacity: 0 
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
          </motion.div>
        )}
      </AnimatePresence>
      
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
      
      {/* Status message that reflects the cleaning stage */}
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
            {!waterFlowing ? "Starting shower... 🚿" :
             showingSoap ? "Scrub-a-dub-dub! 🧼" : 
             showingRinse ? "Rinse time! 💦" : 
             cleaningStage === 0 ? "Let's get clean! 🚿" :
             cleaningStage === 1 ? "Getting cleaner! ✨" :
             cleaningStage === 2 ? "Almost sparkly clean! ✨" :
             "Super clean unicorn! 🦄✨"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
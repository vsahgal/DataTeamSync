import { useState, useEffect, useRef } from "react";
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
  
  // Dancing animation states (same as in DirtyUnicorn component)
  const [position, setPosition] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDancing, setIsDancing] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  // Get the current dirtiness level from stats
  const stats = getShowerStats();
  const getDaysSinceLastShower = (dateString: string) => {
    const lastShowerDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - lastShowerDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // For shower animation, always start with a dirty unicorn (level 3-5)
  // We'll force a minimum of 3 even if they showered today, to make the cleaning effect more visible
  const initialDirtiness = stats.lastShowerDate ? 
    Math.max(3, Math.min(5, getDaysSinceLastShower(stats.lastShowerDate) + 3)) : 
    4;
  
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
  
  // Handle dancing animation (same as in DirtyUnicorn component)
  useEffect(() => {
    if (isDancing) {
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
          setIsDancing(false);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // Reset animation states when not dancing
      setPosition(0);
      setRotation(0);
      setScale(1);
      
      // Clear any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isDancing]);

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
        
        // Celebration dance (like in Home screen) instead of just a jump
        setIsDancing(true);
        
        // Set a timer to start a final excited jump after dancing
        const celebrationTimer = setTimeout(() => {
          setUnicornJumping(true);
          setTimeout(() => setUnicornJumping(false), 1500);
        }, 2500); // Dance for 2.5 seconds, then jump
        
        return () => {
          clearTimeout(celebrationTimer);
        };
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
    // Always start with plenty of dirt spots (at least 15) to make cleaning more dramatic
    const baseSpots = Math.max(15, initialDirtiness * 4); 
    
    // Add even more dirt spots for better visibility - make it really dirty!
    const scaledBaseSpots = baseSpots * 1.5;
    
    // Reduce dirt spots as cleaning progresses
    const reduction = cleaningStage * (scaledBaseSpots / 3); // Full cleaning (stage 3) removes all dirt
    const currentSpots = Math.max(0, Math.floor(scaledBaseSpots - reduction));
    
    return currentSpots;
  };
  
  // Generate dirt spots for the unicorn - using same style as DirtyUnicorn component
  const generateDirtSpots = () => {
    const spots = [];
    const totalSpots = calculateDirtSpots();
    
    // Base dirt opacity calculation similar to DirtyUnicorn component
    const baseOpacity = 0.3;
    const dirtOpacity = baseOpacity + (initialDirtiness * 0.35);
    // Reduce opacity based on cleaning stage
    const currentOpacity = dirtOpacity - (cleaningStage * 0.25);
    
    // Add dirt spots in consistent locations as in the DirtyUnicorn component
    if (initialDirtiness > 0 && totalSpots > 0) {
      // Main body dirt spots - same positions as DirtyUnicorn
      spots.push(
        <motion.circle 
          key="dirt-body-1"
          cx="130" cy="140" 
          r={16 + Math.min(4, initialDirtiness) * 3} 
          fill="#A67F75" 
          fillOpacity={currentOpacity}
          animate={{
            opacity: [currentOpacity, currentOpacity * 0.7, currentOpacity],
            scale: [1, 0.95, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      );
      
      spots.push(
        <motion.circle 
          key="dirt-body-2"
          cx="170" cy="180" 
          r={13 + Math.min(5, initialDirtiness) * 3} 
          fill="#A67F75" 
          fillOpacity={currentOpacity - 0.05}
          animate={{
            opacity: [(currentOpacity - 0.05), (currentOpacity - 0.05) * 0.7, (currentOpacity - 0.05)],
            scale: [1, 0.97, 1]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.3
          }}
        />
      );
      
      spots.push(
        <motion.circle 
          key="dirt-body-3"
          cx="100" cy="170" 
          r={10 + Math.min(6, initialDirtiness) * 3} 
          fill="#A67F75" 
          fillOpacity={currentOpacity - 0.1}
          animate={{
            opacity: [(currentOpacity - 0.1), (currentOpacity - 0.1) * 0.7, (currentOpacity - 0.1)],
            scale: [1, 0.93, 1]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
      );
      
      // Extra dirt spots for dirtier unicorns
      if (initialDirtiness >= 4 && totalSpots >= 12) {
        spots.push(
          <motion.circle 
            key="dirt-body-4"
            cx="150" cy="150" 
            r={10 + (initialDirtiness - 4) * 6} 
            fill="#A67F75" 
            fillOpacity={currentOpacity}
            animate={{
              opacity: [currentOpacity, currentOpacity * 0.6, currentOpacity],
              scale: [1, 0.92, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.2
            }}
          />
        );
        
        spots.push(
          <motion.circle 
            key="dirt-body-5"
            cx="190" cy="150" 
            r={8 + (initialDirtiness - 4) * 6} 
            fill="#A67F75" 
            fillOpacity={currentOpacity - 0.1}
            animate={{
              opacity: [(currentOpacity - 0.1), (currentOpacity - 0.1) * 0.6, (currentOpacity - 0.1)],
              scale: [1, 0.94, 1]
            }}
            transition={{
              duration: 2.3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.4
            }}
          />
        );
      }
      
      // Even more dirt spots for very dirty unicorns
      if (initialDirtiness >= 5 && totalSpots >= 18) {
        spots.push(
          <motion.circle 
            key="dirt-body-6"
            cx="140" cy="160" 
            r={7 + (initialDirtiness - 5) * 8} 
            fill="#896058" 
            fillOpacity={currentOpacity + 0.15}
            animate={{
              opacity: [(currentOpacity + 0.15), (currentOpacity + 0.15) * 0.7, (currentOpacity + 0.15)],
              scale: [1, 0.96, 1]
            }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.3
            }}
          />
        );
        
        spots.push(
          <motion.circle 
            key="dirt-body-7"
            cx="180" cy="140" 
            r={6 + (initialDirtiness - 5) * 8} 
            fill="#896058" 
            fillOpacity={currentOpacity + 0.15}
            animate={{
              opacity: [(currentOpacity + 0.15), (currentOpacity + 0.15) * 0.7, (currentOpacity + 0.15)],
              scale: [1, 0.95, 1]
            }}
            transition={{
              duration: 1.9,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.1
            }}
          />
        );
        
        // Add dirt on legs - just like in DirtyUnicorn
        spots.push(
          <motion.circle 
            key="dirt-leg-1"
            cx="97" cy="220" 
            r={8 + Math.min(4, initialDirtiness) * 2} 
            fill="#896058" 
            fillOpacity={currentOpacity}
            animate={{
              opacity: [currentOpacity, currentOpacity * 0.7, currentOpacity],
              scale: [1, 0.93, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.2
            }}
          />
        );
        
        spots.push(
          <motion.circle 
            key="dirt-leg-2"
            cx="127" cy="230" 
            r={9 + Math.min(4, initialDirtiness) * 2} 
            fill="#896058" 
            fillOpacity={currentOpacity - 0.05}
            animate={{
              opacity: [(currentOpacity - 0.05), (currentOpacity - 0.05) * 0.7, (currentOpacity - 0.05)],
              scale: [1, 0.94, 1]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.6
            }}
          />
        );
        
        // Add dirt on face - matching DirtyUnicorn
        spots.push(
          <motion.circle 
            key="dirt-face-1"
            cx="180" cy="110" 
            r={8 + Math.min(4, initialDirtiness) * 3} 
            fill="#896058" 
            fillOpacity={currentOpacity}
            animate={{
              opacity: [currentOpacity, currentOpacity * 0.7, currentOpacity],
              scale: [1, 0.92, 1]
            }}
            transition={{
              duration: 2.3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.3
            }}
          />
        );
      }
    }
    
    return spots;
  };
  
  // Generate sparkles for clean unicorn - matching DirtyUnicorn component's star style
  const generateSparkles = () => {
    if (cleaningStage < 2) return null;
    
    const sparkles = [];
    
    // Only show sparkles in later cleaning stages
    if (cleaningStage >= 2) {
      // Main sparkles around the unicorn - matching DirtyUnicorn placement
      sparkles.push(
        <g key="sparkle-1" className="transition-all duration-500 ease-in-out">
          <motion.path 
            d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" 
            transform="translate(190, 80) scale(0.9)"
            fill="#FFD700"
            animate={{
              opacity: [0.9, 0.5, 0.9],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </g>
      );
      
      sparkles.push(
        <g key="sparkle-2" className="transition-all duration-500 ease-in-out">
          <motion.path 
            d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" 
            transform="translate(100, 140) scale(0.7)"
            fill="#FFD700"
            animate={{
              opacity: [0.7, 0.4, 0.7],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.3
            }}
          />
        </g>
      );
      
      sparkles.push(
        <g key="sparkle-3" className="transition-all duration-600 ease-in-out">
          <motion.path 
            d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" 
            transform="translate(160, 190) scale(0.6)"
            fill="#FFD700"
            animate={{
              opacity: [0.6, 0.4, 0.6],
              scale: [1, 0.95, 1]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
        </g>
      );
    }
    
    // Extra sparkles for the final cleaning stage
    if (cleaningStage >= 3) {
      sparkles.push(
        <g key="sparkle-4" className="transition-all duration-500 ease-in-out">
          <motion.path 
            d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" 
            transform="translate(220, 130) scale(0.65)"
            fill="#FFD700"
            animate={{
              opacity: [0.8, 0.5, 0.8],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.2
            }}
          />
        </g>
      );
      
      sparkles.push(
        <g key="sparkle-5" className="transition-all duration-500 ease-in-out">
          <motion.path 
            d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" 
            transform="translate(130, 100) scale(0.55)"
            fill="#FFD700"
            animate={{
              opacity: [0.7, 0.4, 0.7],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.9,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.6
            }}
          />
        </g>
      );
      
      sparkles.push(
        <g key="sparkle-6" className="transition-all duration-600 ease-in-out">
          <motion.path 
            d="M12 3L13.5 9H19.5L14.5 13L16 19L12 15L8 19L9.5 13L4.5 9H10.5L12 3Z" 
            transform="translate(80, 170) scale(0.5)"
            fill="#FFD700"
            animate={{
              opacity: [0.6, 0.3, 0.6],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 2.3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.4
            }}
          />
        </g>
      );
    }
    
    return sparkles;
  };
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-50">
      {/* Timer moved to top-right to not block the shower head */}
      <div className="absolute top-4 right-6 z-50">
        <div className="w-40 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full shadow-lg text-center">
          <p className="text-3xl font-bold text-blue-600 font-mono">
            {formattedTime}
          </p>
        </div>
      </div>
      
      {/* Water streams and drops - only shown when water is flowing */}
      <AnimatePresence>
        {waterFlowing && (
          <>
            {/* Main shower water streams */}
            <motion.div 
              className="absolute top-24 left-1/2 transform -translate-x-1/2 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`stream-${i}`}
                  className="absolute top-0"
                  style={{
                    left: (i * 5) - 28, // spread out streams
                    width: '3px',
                    height: '120px',
                    background: 'linear-gradient(to bottom, rgba(185, 220, 255, 0.9), rgba(145, 200, 255, 0.4))',
                    borderRadius: '1px'
                  }}
                  animate={{
                    scaleY: [0.95, 1.05, 0.95],
                    opacity: [0.7, 0.9, 0.7]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                />
              ))}
            </motion.div>
            
            {/* Random water drops throughout */}
            <motion.div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {Array.from({ length: 25 }).map((_, index) => (
                <motion.div
                  key={`drop-${index}`}
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
          </>
        )}
      </AnimatePresence>
      
      {/* Enhanced shower head with water startup animation */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {/* Shower arm */}
          <div className="w-4 h-12 bg-gray-400 absolute top-0 left-1/2 transform -translate-x-1/2" />
          
          {/* Shower head - larger and more visible */}
          <motion.div 
            className="w-32 h-10 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg mt-12"
            animate={{
              y: waterFlowing ? [0, -2, 0] : 0
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Shower holes with water animation */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-gray-500 rounded-b-lg flex justify-around items-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div 
                key={i}
                className="w-1.5 h-1.5 bg-blue-300 rounded-full"
                animate={{ 
                  opacity: waterFlowing ? [0.7, 1, 0.7] : 0,
                  scale: waterFlowing ? [1, 1.3, 1] : 1
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
          
          {/* Shower handle/knob */}
          <motion.div 
            className="absolute top-6 left-full ml-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-gray-300"
            animate={{
              rotate: waterFlowing ? 45 : 0,
              scale: waterFlowing ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-1 bg-white rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Unicorn with cleaning animation */}
      <motion.div
        className="relative z-10"
        style={{
          transform: isDancing ? `translateY(${position}px) rotate(${rotation}deg) scale(${scale})` : 'none',
          transition: 'transform 0.1s ease-out'
        }}
        animate={
          isDancing 
            ? { y: 0 } // No animation when dancing (dancing uses transform)
            : (unicornJumping 
                ? { y: [0, -30, -20, -25, 0] } // big jump when cleaning happens
                : (waterFlowing 
                    ? { y: [0, -5, 0] } // gentle float when showering
                    : { y: 0 }) // static when water not flowing
              )
        }
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
            {!waterFlowing ? "Oh no, dirty unicorn! Let's start the shower... 🚿" :
             showingSoap ? "Scrub-a-dub-dub! Washing away the dirt! 🧼" : 
             showingRinse ? (isDancing ? "Hooray! Clean unicorn is dancing! 💃 🦄" : "Rinse time! Washing away the soap! 💦") : 
             cleaningStage === 0 ? "So dirty! Let's get clean! 🚿" :
             cleaningStage === 1 ? "Getting cleaner! The dirt is washing away! ✨" :
             cleaningStage === 2 ? "Almost sparkly clean! Just a bit more! ✨" :
             "Super clean unicorn! No more dirt! 🦄✨"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
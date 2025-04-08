import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getShowerStats } from "@/lib/storage";
import newUnicornImage from "../assets/unicorn-with-wings.png";

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
  
  // Dancing animation states
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
    }
  }, [isShowering, initialized, initialDirtiness]);
  
  // Handle dancing animation
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
        
        // Celebration dance (like in Home screen)
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
  
  // Rainbow colors for clean unicorn
  const rainbowColors = ["#FFB6D9", "#B5DEFF", "#D9B5FF", "#B5FFD9"];

  // Function to generate dirt spots for overlay on the unicorn
  const generateDirtOverlay = () => {
    // Reduce dirt based on cleaning stage
    const dirtOpacity = 0.7 - (cleaningStage * 0.2);
    
    if (cleaningStage === 3) return null; // No dirt when fully clean
    
    return (
      <div 
        className="absolute inset-0 rounded-full bg-brown-500" 
        style={{ 
          backgroundColor: '#A67F75',
          opacity: dirtOpacity,
          mixBlendMode: 'multiply',
          filter: 'blur(3px)',
          clipPath: 'ellipse(65% 60% at 50% 50%)'
        }}
      />
    );
  };
  
  // Generate sparkles around the unicorn
  const generateSparkles = () => {
    if (cleaningStage < 2) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-4 h-4 bg-yellow-300"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              borderRadius: '50%',
              boxShadow: '0 0 8px 2px rgba(255, 215, 0, 0.6)'
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 0.5
            }}
          />
        ))}
      </div>
    );
  };
  
  // Generate soap bubbles when soaping
  const generateSoapBubbles = () => {
    if (!showingSoap) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: `${10 + Math.random() * 15}px`,
              height: `${10 + Math.random() * 15}px`,
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              opacity: 0.8,
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: 'inset -2px -2px 4px rgba(0, 0, 0, 0.1)'
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random()
            }}
          />
        ))}
      </div>
    );
  };
  
  // Generate rinse water streams
  const generateRinseStreams = () => {
    if (!showingRinse) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`rinse-${i}`}
            className="absolute bg-blue-300"
            style={{
              width: '3px',
              height: '40px',
              top: `${30 + (i % 3) * 20}%`,
              left: `${20 + (i * 8)}%`,
              opacity: 0.7,
              borderRadius: '999px'
            }}
            animate={{
              height: ['40px', '60px', '40px'],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    );
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
          >
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
          </motion.div>
          
          {/* Shower handle/knob that turns when water starts flowing */}
          <motion.div 
            className="absolute top-5 right-1 w-6 h-6 bg-gray-400 rounded-full border-2 border-gray-500"
            animate={{
              rotate: waterFlowing ? 180 : 0
            }}
            transition={{
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-gray-600 transform -translate-y-1/2" />
          </motion.div>
        </div>
      </div>
      
      {/* Unicorn with cleaning animation */}
      <motion.div
        className="relative z-10 w-56 h-56"
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
        {/* Rainbow effect for clean unicorn (appears at cleaning stage 2+) */}
        {cleaningStage >= 2 && (
          <motion.div 
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/4 scale-150"
              style={{
                background: `linear-gradient(to right, ${rainbowColors.join(', ')})`,
                opacity: 0.4,
                filter: 'blur(8px)',
                borderRadius: '50%',
                zIndex: -1
              }}
            />
          </motion.div>
        )}
        
        {/* Unicorn image */}
        <div className="relative w-full h-full">
          <img 
            src={newUnicornImage} 
            alt="Unicorn" 
            className="w-4/5 h-4/5 object-contain mx-auto"
          />
          
          {/* Dirt overlay */}
          {generateDirtOverlay()}
          
          {/* Sparkles */}
          {generateSparkles()}
          
          {/* Soap bubbles */}
          {generateSoapBubbles()}
          
          {/* Rinse streams */}
          {generateRinseStreams()}
        </div>
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
import { motion } from "framer-motion";

interface WaterAnimationProps {
  isWaterOn: boolean;
}

export default function WaterAnimation({ isWaterOn }: WaterAnimationProps) {
  if (!isWaterOn) return null;
  
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Water drops */}
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-4 bg-blue-400 rounded-full opacity-70"
          initial={{ 
            top: "-10%", 
            left: `${30 + Math.random() * 40}%` 
          }}
          animate={{ 
            top: "100%",
            opacity: [0.8, 0.7, 0]
          }}
          transition={{ 
            duration: 1 + Math.random() * 0.5, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "easeIn"
          }}
        />
      ))}
      
      {/* Water splash */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center">
        <motion.div
          className="w-8 h-8 rounded-full bg-blue-300 opacity-70"
          animate={{
            scale: [0.5, 1.5, 0],
            opacity: [0.2, 0.5, 0]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </div>
      
      {/* Water mist */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-blue-200 opacity-30 blur-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Blue overlay to give water ambiance */}
      <div className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-20" />
    </div>
  );
}

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CharacterDisplayProps {
  isShowering: boolean;
  points: number;
}

export default function CharacterDisplay({ isShowering, points }: CharacterDisplayProps) {
  const [expression, setExpression] = useState<'happy' | 'excited' | 'neutral'>('neutral');
  
  useEffect(() => {
    if (isShowering) {
      setExpression('happy');
    } else if (points > 50) {
      setExpression('excited');
    } else {
      setExpression('neutral');
    }
  }, [isShowering, points]);
  
  return (
    <div className="mb-4 relative">
      <motion.div
        className="relative z-10"
        animate={isShowering ? {
          y: [0, -5, 0],
        } : {}}
        transition={{
          duration: 1,
          repeat: isShowering ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        <svg 
          width="150" 
          height="150" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <motion.circle 
            cx="100" 
            cy="100" 
            r="70" 
            fill="#4A9BE8"
            animate={isShowering ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: isShowering ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          
          {/* Face */}
          <circle cx="100" cy="100" r="60" fill="#63B3FF" />
          
          {/* Eyes */}
          <g>
            <circle cx="75" cy="85" r="8" fill="white" />
            <circle cx="125" cy="85" r="8" fill="white" />
            
            <motion.circle 
              cx="75" 
              cy="85" 
              r="4" 
              fill="#333"
              animate={isShowering ? {
                y: [-1, 1, -1]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.circle 
              cx="125" 
              cy="85" 
              r="4" 
              fill="#333"
              animate={isShowering ? {
                y: [-1, 1, -1]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </g>
          
          {/* Mouth - changes based on expression */}
          {expression === 'happy' && (
            <path 
              d="M80 120 Q100 140 120 120" 
              stroke="#333" 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round"
            />
          )}
          
          {expression === 'excited' && (
            <g>
              <path 
                d="M80 120 Q100 150 120 120" 
                stroke="#333" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
              />
              <motion.path 
                d="M90 140 L95 130 L100 140 L105 130 L110 140" 
                stroke="#FF5757" 
                strokeWidth="2" 
                fill="none"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </g>
          )}
          
          {expression === 'neutral' && (
            <path 
              d="M85 120 L115 120" 
              stroke="#333" 
              strokeWidth="4" 
              strokeLinecap="round"
            />
          )}
          
          {/* Bubbles */}
          {isShowering && (
            <>
              <motion.circle 
                cx="140" 
                cy="70" 
                r="10" 
                fill="white" 
                fillOpacity="0.8"
                animate={{
                  y: [-20, 0, -20],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              />
              <motion.circle 
                cx="60" 
                cy="60" 
                r="8" 
                fill="white" 
                fillOpacity="0.8"
                animate={{
                  y: [-15, 0, -15],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.2
                }}
              />
              <motion.circle 
                cx="150" 
                cy="100" 
                r="6" 
                fill="white" 
                fillOpacity="0.8"
                animate={{
                  y: [-10, 0, -10],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              />
            </>
          )}
        </svg>
        
        {/* Speech Bubble */}
        {isShowering ? (
          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <p className="text-sm font-medium text-blue-600">Shower time!</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
          </motion.div>
        ) : points > 50 ? (
          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <p className="text-sm font-medium text-green-600">Great job!</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
          </motion.div>
        ) : (
          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <p className="text-sm font-medium text-gray-600">Ready to shower?</p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-white"></div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

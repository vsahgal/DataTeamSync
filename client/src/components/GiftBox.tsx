import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LootItem } from '@/lib/lootItems';
import { Button } from '@/components/ui/button';

interface GiftBoxProps {
  visible: boolean;
  onOpen: (item: LootItem) => void;
  lootItem: LootItem;
}

export default function GiftBox({ visible, onOpen, lootItem }: GiftBoxProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showItem, setShowItem] = useState(false);

  // Debug logging
  console.log("GiftBox rendering", { visible, lootItem, isOpening, showItem });
  
  const handleOpen = () => {
    console.log("GiftBox: handleOpen called");
    setIsOpening(true);
    
    // After longer animation, show the item inside
    setTimeout(() => {
      console.log("GiftBox: showing item inside");
      setShowItem(true);
      
      // Then after showing item for a longer moment, complete the sequence
      setTimeout(() => {
        console.log("GiftBox: animation complete, calling onOpen");
        onOpen(lootItem);
      }, 4000); // Increased from 2000ms to 4000ms for more time to see the item
    }, 1500); // Increased from 1000ms to 1500ms for slower opening
  };
  
  if (!visible) {
    console.log("GiftBox: not visible, returning null");
    return null;
  }
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="relative flex flex-col items-center">
            {/* The gift box - using the provided image */}
            <motion.div 
              className="relative cursor-pointer"
              onClick={!isOpening ? handleOpen : undefined}
              whileHover={!isOpening ? { scale: 1.05 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
              animate={isOpening ? 
                { y: 50, scale: 0.7, opacity: 0, rotate: 10 } : 
                { 
                  y: [0, -12, 0], 
                  opacity: 1,
                  rotate: [-5, 5, -5]
                }
              }
              transition={{
                y: {
                  duration: 3,
                  repeat: !isOpening ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 6,
                  repeat: !isOpening ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                opacity: {
                  duration: isOpening ? 0.8 : 0,
                  delay: isOpening ? 0.3 : 0
                },
                scale: {
                  duration: isOpening ? 0.8 : 0,
                  delay: isOpening ? 0.3 : 0
                }
              }}
            >
              {/* Yellow gift box with red ribbon (CSS version) */}
              <div className="relative w-60 h-60">
                {/* Gift box base - bright yellow like in the image */}
                <motion.div 
                  className="absolute w-48 h-48 bg-[#FFD800] rounded-md shadow-lg"
                  animate={isOpening ? { 
                    scaleY: 0.5, 
                    y: 60,
                    transition: { delay: 0.5, duration: 0.4 } 
                  } : {}}
                  style={{ 
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
                
                {/* Gift box lid - same yellow */}
                <motion.div 
                  className="absolute w-52 h-12 bg-[#FFD800] rounded-t-md shadow-sm top-[-10px]"
                  animate={isOpening ? {
                    y: -60,
                    rotateX: 60,
                    opacity: 0,
                    transition: { duration: 0.5 }
                  } : {}}
                  style={{ 
                    boxShadow: "0 -5px 15px -5px rgba(0,0,0,0.05)",
                    left: "50%",
                    transform: "translateX(-50%)"
                  }}
                />
                
                {/* Gift ribbon - bright red vertical */}
                <motion.div 
                  className="absolute h-full w-8 bg-[#FF2E4A] top-0 rounded-b-sm"
                  animate={isOpening ? {
                    opacity: 0,
                    transition: { delay: 0.3, duration: 0.3 }
                  } : {}}
                  style={{ 
                    left: "50%",
                    transform: "translateX(-50%)"
                  }}
                />
                
                {/* Gift ribbon - bright red horizontal */}
                <motion.div 
                  className="absolute w-48 h-8 bg-[#FF2E4A] rounded-r-sm"
                  animate={isOpening ? {
                    opacity: 0,
                    transition: { delay: 0.3, duration: 0.3 }
                  } : {}}
                  style={{ 
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                />
                
                {/* Bow at the top - larger and more prominent */}
                <motion.div 
                  className="absolute top-[-40px] z-10"
                  animate={isOpening ? {
                    scale: 0,
                    transition: { delay: 0.2, duration: 0.3 }
                  } : {}}
                  style={{ 
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "40px"
                  }}
                >
                  {/* Left bow loop */}
                  <motion.div 
                    className="absolute top-1/2 left-0 w-12 h-16 bg-[#FF2E4A] rounded-full transform -translate-y-1/2 origin-right"
                    style={{ transform: "translateY(-50%) rotate(-30deg)" }}
                  />
                  
                  {/* Right bow loop */}
                  <motion.div 
                    className="absolute top-1/2 right-0 w-12 h-16 bg-[#FF2E4A] rounded-full transform -translate-y-1/2 origin-left"
                    style={{ transform: "translateY(-50%) rotate(30deg)" }}
                  />
                  
                  {/* Center knot */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-10 h-10 bg-[#FF2E4A] rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  />
                </motion.div>
              </div>
              
              {/* Decorative stars */}
              <motion.div
                className="absolute -top-10 -left-10 text-xl text-cyan-400"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                ★
              </motion.div>
              
              <motion.div
                className="absolute -top-5 -right-10 text-2xl text-amber-400"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                ★
              </motion.div>
              
              <motion.div
                className="absolute -bottom-8 -right-5 text-lg text-pink-400"
                animate={{ 
                  rotate: 360,
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                ★
              </motion.div>
              
              {/* The revealed item - enhanced */}
              {showItem && (
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white bg-opacity-90 p-5 rounded-full shadow-lg"
                  initial={{ scale: 0, opacity: 0, rotate: -10 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 1, 
                    rotate: 0,
                    y: -10 
                  }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.8 }}
                >
                  <div className="text-6xl">{lootItem.emoji}</div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Tap hint removed as requested */}
            
            {/* Item name and info - appears after opening */}
            {showItem && (
              <motion.div 
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-lg font-bold mb-1 bg-white bg-opacity-90 px-4 py-1 rounded-full shadow-sm">
                  {lootItem.name}
                </div>
                <div className="text-sm font-medium text-gray-600 bg-white bg-opacity-70 px-3 py-1 rounded-full max-w-[200px]">
                  {lootItem.description}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
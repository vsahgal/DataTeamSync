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
  
  const handleOpen = () => {
    setIsOpening(true);
    
    // After animation, show the item inside
    setTimeout(() => {
      setShowItem(true);
      
      // Then after showing item for a moment, complete the sequence
      setTimeout(() => {
        onOpen(lootItem);
      }, 2000);
    }, 1000);
  };
  
  if (!visible) return null;
  
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
            {/* The gift box */}
            <motion.div 
              className="w-52 h-52 relative cursor-pointer"
              onClick={!isOpening ? handleOpen : undefined}
              whileHover={!isOpening ? { scale: 1.05 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
              animate={{ y: !isOpening ? [0, -10, 0] : 0 }}
              transition={{ y: { duration: 2, repeat: !isOpening ? Infinity : 0, repeatType: "reverse" } }}
            >
              {/* Gift box body */}
              <motion.div 
                className="absolute inset-0 bg-amber-300 rounded-xl shadow-lg"
                animate={isOpening ? { 
                  scaleY: 0.5, 
                  y: 60,
                  transition: { delay: 0.5, duration: 0.4 } 
                } : {}}
              />
              
              {/* Gift box lid */}
              <motion.div 
                className="absolute inset-x-0 top-0 h-1/4 bg-amber-400 rounded-t-xl"
                animate={isOpening ? {
                  y: -60,
                  rotateX: 60,
                  opacity: 0,
                  transition: { duration: 0.5 }
                } : {}}
              />
              
              {/* Gift ribbon - vertical */}
              <motion.div className="absolute top-0 left-1/2 w-8 h-full bg-red-500 transform -translate-x-1/2"
                animate={isOpening ? {
                  opacity: 0,
                  transition: { delay: 0.3, duration: 0.3 }
                } : {}}
              />
              
              {/* Gift ribbon - horizontal */}
              <motion.div className="absolute top-1/2 left-0 w-full h-8 bg-red-500 transform -translate-y-1/2"
                animate={isOpening ? {
                  opacity: 0,
                  transition: { delay: 0.3, duration: 0.3 }
                } : {}}
              />
              
              {/* Bow at the top */}
              <motion.div 
                className="absolute top-0 left-1/2 w-20 h-10 transform -translate-x-1/2 -translate-y-4 z-10"
                animate={isOpening ? {
                  scale: 0,
                  transition: { delay: 0.2, duration: 0.3 }
                } : {}}
              >
                {/* Left bow loop */}
                <motion.div 
                  className="absolute top-1/2 left-0 w-8 h-10 bg-red-500 rounded-full transform -translate-y-1/2 origin-right"
                  style={{ transform: "translateY(-50%) rotate(-30deg)" }}
                />
                
                {/* Right bow loop */}
                <motion.div 
                  className="absolute top-1/2 right-0 w-8 h-10 bg-red-500 rounded-full transform -translate-y-1/2 origin-left"
                  style={{ transform: "translateY(-50%) rotate(30deg)" }}
                />
                
                {/* Center knot */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                />
              </motion.div>
              
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
              
              {/* The revealed item */}
              {showItem && (
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-white bg-opacity-90 p-5 rounded-full shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
                >
                  <div className="text-6xl">{lootItem.emoji}</div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Tap hint */}
            {!isOpening && (
              <div className="text-sm text-gray-500 mt-2 animate-pulse">
                Tap to open
              </div>
            )}
            
            {/* Item name and info */}
            {showItem && (
              <motion.div 
                className="mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="text-lg font-bold mb-1 bg-white bg-opacity-90 px-4 py-1 rounded-full shadow-sm">
                  {lootItem.name}
                </div>
                <div className="text-sm text-gray-600 bg-white bg-opacity-70 px-3 py-1 rounded-full">
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
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LootItem } from '@/lib/lootItems';

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
    
    setTimeout(() => {
      setShowItem(true);
      setTimeout(() => {
        onOpen(lootItem);
      }, 2000);
    }, 1000);
  };
  
  console.log("GiftBox render - visible:", visible, "lootItem:", lootItem);

  return (
    <AnimatePresence>
      {(
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div 
              className="w-52 h-52 relative cursor-pointer"
              onClick={!isOpening ? handleOpen : undefined}
              whileHover={!isOpening ? { scale: 1.05 } : {}}
              whileTap={!isOpening ? { scale: 0.95 } : {}}
              animate={{ y: !isOpening ? [0, -10, 0] : 0 }}
              transition={{ y: { duration: 2, repeat: !isOpening ? Infinity : 0, repeatType: "reverse" } }}
            >
              <div className="absolute inset-0 bg-amber-300 rounded-xl shadow-lg" />
              <div className="absolute inset-x-0 top-0 h-1/4 bg-amber-400 rounded-t-xl" />
              <div className="absolute top-0 left-1/2 w-8 h-full bg-red-500 transform -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 w-full h-8 bg-red-500 transform -translate-y-1/2" />
              
              <div className="absolute top-0 left-1/2 w-20 h-10 transform -translate-x-1/2 -translate-y-4 z-10">
                <div className="absolute top-1/2 left-0 w-8 h-10 bg-red-500 rounded-full transform -translate-y-1/2 rotate-[-30deg] origin-right" />
                <div className="absolute top-1/2 right-0 w-8 h-10 bg-red-500 rounded-full transform -translate-y-1/2 rotate-[30deg] origin-left" />
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              {/* Stars */}
              <div className="absolute -top-6 -left-6 text-2xl text-cyan-500">★</div>
              <div className="absolute -top-4 -right-6 text-xl text-amber-500">★</div>
              <div className="absolute -bottom-6 -right-4 text-lg text-pink-500">★</div>
              
              {/* Revealed item */}
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
            
            {/* Item info */}
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
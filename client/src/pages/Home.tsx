import { useEffect, useState } from "react";
import UnicornShower from "@/components/UnicornShower";
import DirtyUnicorn from "@/components/DirtyUnicorn";
import AnimatedLevelIndicator from "@/components/AnimatedLevelIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useToast } from "@/hooks/use-toast";
import useShowerState from "@/hooks/useShowerState";
import { 
  getShowerStats, 
  getShowerSessions, 
  getPendingLoot, 
  setPendingLoot as storageSavePendingLoot, 
  addCollectedLoot, 
  getCollectedLoot 
} from "@/lib/storage";
import { LEVELS } from "@/lib/constants";
import { Droplets, Zap, Award, BarChart, Gift } from "lucide-react";
import { ShowerStats, LocalShowerSession } from "@shared/schema";
import Confetti from "react-confetti";
import { getRandomLootItem, LootItem, lootItems, CollectedItem } from "@/lib/lootItems";
import GiftBox from "@/components/GiftBox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Create a test loot item for debugging
const TEST_LOOT = lootItems[0];

// Helper function to calculate days since last shower
// COMMENT OUT THIS SECTION WHEN DEPLOYING TO PRODUCTION - START
// FOR TESTING ONLY: Using seconds instead of days (5 seconds = 1 "day")
const getDaysSinceLastShower = (lastShowerDate: string): number => {
  const lastDate = new Date(lastShowerDate);
  const today = new Date();
  
  // For testing: Calculate difference in seconds and consider every 5 seconds as 1 "day"
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffDays = Math.floor(diffSeconds / 5);
  
  // Cap at 7 days maximum
  return Math.min(diffDays, 7);
};
// COMMENT OUT THIS SECTION WHEN DEPLOYING TO PRODUCTION - END

// UNCOMMENT THIS SECTION WHEN DEPLOYING TO PRODUCTION - START
/*
// Production version: Calculate actual days difference
const getDaysSinceLastShower = (lastShowerDate: string): number => {
  const lastDate = new Date(lastShowerDate);
  const today = new Date();
  
  // Reset time part to avoid partial day calculations
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Cap at 7 days maximum
  return Math.min(diffDays, 7);
};
*/
// UNCOMMENT THIS SECTION WHEN DEPLOYING TO PRODUCTION - END

export default function Home() {
  const { toast } = useToast();
  const { 
    isShowering, 
    elapsedTime, 
    points, 
    startShower, 
    stopShower, 
    isWaterOn,
    didLevelUp,
    newLevel,
    resetLevelUp
  } = useShowerState();
  
  const [stats, setStats] = useState<ShowerStats>({
    totalSessions: 0,
    totalPoints: 0,
    longestShower: 0,
    streakDays: 0,
    lastShowerDate: null,
    level: 1,
    lastLevelUp: null
  });
  
  // Update stats when shower status changes
  useEffect(() => {
    setStats(getShowerStats());
  }, [isShowering]);
  
  // COMMENT OUT THIS SECTION WHEN DEPLOYING TO PRODUCTION - START
  // Automatically update stats periodically to keep dirtiness current (FOR TESTING)
  useEffect(() => {
    if (!isShowering) {
      // Refresh stats every 5 seconds to update dirtiness (FOR TESTING)
      const intervalId = setInterval(() => {
        setStats(getShowerStats());
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [isShowering]);
  // COMMENT OUT THIS SECTION WHEN DEPLOYING TO PRODUCTION - END
  
  // UNCOMMENT THIS SECTION WHEN DEPLOYING TO PRODUCTION - START
  /*
  // Automatically update stats periodically to keep the UI current (FOR PRODUCTION)
  useEffect(() => {
    if (!isShowering) {
      // In production, we only need to refresh once per hour to check for day changes
      const intervalId = setInterval(() => {
        setStats(getShowerStats());
      }, 3600000); // Once per hour in milliseconds
      
      return () => clearInterval(intervalId);
    }
  }, [isShowering]);
  */
  // UNCOMMENT THIS SECTION WHEN DEPLOYING TO PRODUCTION - END
  
  const handleStart = () => {
    startShower();
    toast({
      title: "Shower started!",
      description: "Let's get clean and earn 50 points!",
      variant: "default",
    });
  };
  
  const handleStop = () => {
    const earnedPoints = stopShower();
    
    // Set the justCompletedShower flag to trigger progress animation
    setJustCompletedShower(true);
    
    // Clear the flag after a delay to allow time for UI updates and animations
    setTimeout(() => {
      setJustCompletedShower(false);
      
      // Always generate a loot item when a shower is completed
      const newLoot = getRandomLootItem();
      
      // Directly set the loot item to show
      storageSavePendingLoot(newLoot);
      setPendingLootState(newLoot);
    }, 2500);
    
    toast({
      title: "Shower completed!",
      description: `Great job! You earned ${earnedPoints} points.`,
      variant: "default",
    });
  };
  
  // State to manage the opened box with revealed item and animation
  const [openedItem, setOpenedItem] = useState<LootItem | null>(null);
  
  // Function to scroll to the newest item in carousel (simplified)
  const scrollToNewestItem = () => {
    try {
      // Get carousel API and scroll to the end
      if (carouselApi) {
        console.log("Scrolling carousel to the end where new items are added");
        
        // Get all items in the carousel
        const carouselItems = document.querySelectorAll('.carousel-item');
        if (carouselItems.length > 0) {
          // Scroll to the last item (most recently added)
          const lastItemIndex = carouselItems.length - 1;
          carouselApi.scrollTo(lastItemIndex);
          console.log("Scrolled to item at index:", lastItemIndex);
        }
      } else {
        console.log("Carousel API not available for scrolling");
      }
    } catch (e) {
      console.error("Error scrolling carousel:", e);
    }
  };
  
  // Function to get target position for animation
  const getTargetPosition = (): {top: number, left: number} => {
    // Target the bottom of the screen, slightly above the carousel
    return {
      top: window.innerHeight - 120,
      left: window.innerWidth / 2
    };
  };
  
  // Handle opening the gift box and collecting the loot
  const handleOpenGift = (item: LootItem) => {
    // Show the opened box with the item inside first
    setOpenedItem(item);
    
    // Add the item to the collection
    const collectedItem = addCollectedLoot(item);
    
    // Update the state with the refreshed collection
    setCollectedItems(getCollectedLoot());
    
    // Clear the pending loot
    storageSavePendingLoot(null);
    setPendingLootState(null);
    
    // Capture the initial position (center of screen)
    const initialPosition = { 
      top: window.innerHeight / 2, 
      left: window.innerWidth / 2 
    };
    setItemPosition(initialPosition);
    
    // Show a celebration toast
    toast({
      title: `You found a ${item.rarity} item!`,
      description: `${item.name} ${item.emoji} has been added to your collection!`,
      variant: "default",
    });
    
    // Save the current item for use in the animation 
    setCurrentItem(item);
      
    // After a delay, animate the item to the carousel
    setTimeout(() => {
      setOpenedItem(null); // Hide the opened box modal
      
      // A small delay to ensure the item has been added to the DOM
      setTimeout(() => {
        // Start the animation
        setItemAnimating(true);
        
        // Set target position and scroll carousel
        const targetPos = getTargetPosition();
        setTargetPosition(targetPos);
        scrollToNewestItem();
        
        // End the animation after a delay
        setTimeout(() => {
          setItemAnimating(false);
          setCurrentItem(null);
        }, 1500);
      }, 300);
    }, 2000);
  };
  
  // States for managing the level-up celebration sequence
  const [showLevelAnimation, setShowLevelAnimation] = useState(false);
  const [isDancingUnicorn, setIsDancingUnicorn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompletedShower, setJustCompletedShower] = useState(false);
  const [levelUpComplete, setLevelUpComplete] = useState(false);
  const [pauseTimerActive, setPauseTimerActive] = useState(false);
  
  // States for loot system
  const [pendingLoot, setPendingLootState] = useState<LootItem | null>(getPendingLoot());
  const [collectedItems, setCollectedItems] = useState(getCollectedLoot());
  const [delayedLoot, setDelayedLoot] = useState<LootItem | null>(null);
  
  // States for gift animation
  const [itemAnimating, setItemAnimating] = useState(false);
  const [itemPosition, setItemPosition] = useState({ top: 0, left: 0 });
  const [targetPosition, setTargetPosition] = useState({ top: 0, left: 0 });
  const [currentItem, setCurrentItem] = useState<LootItem | null>(null);
  
  // Reference to the carousel API for controlling the scroll position
  const [carouselApi, setCarouselApi] = useState<any>(null);
  
  // We've removed the testing state variables since they're no longer needed
  
  // Helper function to get level info for any level, even beyond predefined levels
  const getLevelInfo = (level: number) => {
    // First check if this is a predefined level
    const predefinedLevel = LEVELS.find(l => l.level === level);
    if (predefinedLevel) {
      return predefinedLevel;
    }
    
    // For levels beyond our predefined list, generate info dynamically
    const levelNames = [
      "Legendary Cleanser",
      "Mythical Washer",
      "Cosmic Bather",
      "Galactic Showerer",
      "Universal Scrubber",
      "Stellar Soaper",
      "Interstellar Hygienist",
      "Celestial Washer"
    ];
    
    // Pick a name based on the level (cycling through the options)
    const nameIndex = (level - LEVELS.length - 1) % levelNames.length;
    
    // Generate colors by cycling through a rainbow pattern
    const hue = ((level - LEVELS.length - 1) * 30) % 360;
    
    return {
      level,
      name: levelNames[nameIndex],
      pointsNeeded: 10000 + (level - LEVELS.length) * 500,
      color: `hsl(${hue}, 80%, 60%)`,
      showersNeeded: 3 // All levels beyond the predefined ones need 3 showers
    };
  };
  
  // Get current level information
  const currentLevelInfo = getLevelInfo(stats.level || 1);
  
  // State-based animation sequence for level up
  // Step 1: Start level-up animation when the level up is detected
  useEffect(() => {
    if (didLevelUp && newLevel) {
      console.log("Starting level-up animation sequence");
      setShowConfetti(true);
      setShowLevelAnimation(true);
      setLevelUpComplete(false);
      setPauseTimerActive(false);
    }
  }, [didLevelUp, newLevel]);

  // Step 2: Start unicorn dancing after level number animation
  useEffect(() => {
    if (showLevelAnimation) {
      const timer = setTimeout(() => {
        console.log("Starting unicorn dance");
        setIsDancingUnicorn(true);
        setShowLevelAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelAnimation]);
  
  // Step 3: End dancing and start the pause before showing reward
  useEffect(() => {
    if (isDancingUnicorn) {
      const timer = setTimeout(() => {
        console.log("Ending unicorn dance");
        setIsDancingUnicorn(false);
        setShowConfetti(false);
        setLevelUpComplete(true);
        resetLevelUp(); // Reset the level-up state
        setPauseTimerActive(true); // Start the pause timer
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isDancingUnicorn, resetLevelUp]);
  
  // Step 4: After pause, show the loot (if any)
  useEffect(() => {
    if (pauseTimerActive) {
      console.log("Starting 3-second pause before showing gift");
      const timer = setTimeout(() => {
        console.log("Pause complete, showing gift");
        setPauseTimerActive(false);
        
        // If we had a delayed loot item, show it now
        if (delayedLoot) {
          console.log("Processing delayed loot item:", delayedLoot);
          storageSavePendingLoot(delayedLoot);
          setPendingLootState(delayedLoot);
          setDelayedLoot(null);
          
          // Double-check that the loot is showing with a separate timeout
          setTimeout(() => {
            // If for some reason the loot didn't show, force it to show
            if (!pendingLoot) {
              console.log("Forcing loot to show after delay");
              setPendingLootState(delayedLoot);
            }
          }, 500);
        } else {
          console.log("No delayed loot to show after animation sequence");
        }
      }, 3000); // Reduced to 3 seconds for better user experience
      return () => clearTimeout(timer);
    }
  }, [pauseTimerActive, delayedLoot]);

  return (
    <div className="flex flex-col gap-2 relative">
      {/* Confetti effect for level-up */}
      {showConfetti && (
        <Confetti 
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
        />
      )}
      
      {/* We've replaced the separate DancingUnicorn component with enhanced DirtyUnicorn */}
      
      {/* We now use the enhanced AnimatedLevelIndicator instead of a separate animation */}
      
      <Card className="overflow-hidden border-4 border-blue-300 bg-white">
        <CardContent className="p-0 relative">
          <div className="p-4 flex flex-col items-center justify-center relative z-10">
            <div className="flex justify-center items-center w-full mb-2">
              <h1 className="text-2xl font-bold text-blue-600 text-center">
                {stats.lastShowerDate ? (
                  getDaysSinceLastShower(stats.lastShowerDate) === 0 ? (
                    <>Zoya had a shower today!</>
                  ) : (
                    <>
                      It's been {getDaysSinceLastShower(stats.lastShowerDate)} day{getDaysSinceLastShower(stats.lastShowerDate) !== 1 ? 's' : ''} since Zoya's last shower
                    </>
                  )
                ) : (
                  <>Zoya's First Shower</>
                )}
              </h1>
            </div>
            
            {/* Animated dirty unicorn */}
            {!isShowering && (
              <div className="text-center py-0 mb-2">
                <DirtyUnicorn 
                  dirtiness={stats.lastShowerDate ? 
                    (getDaysSinceLastShower(stats.lastShowerDate) === 0 ? 0 : Math.min(7, getDaysSinceLastShower(stats.lastShowerDate))) : 
                    3}
                  isDancing={isDancingUnicorn}
                  onDanceComplete={() => setIsDancingUnicorn(false)}
                />
              </div>
            )}
            
            {/* Full-screen unicorn shower animation */}
            {isShowering && (
              <UnicornShower 
                isShowering={isShowering}
                elapsedTime={elapsedTime}
                isActive={isShowering}
                onStopShower={handleStop}
              />
            )}
            
            <div className="w-full mt-0 mb-2">
              {!isShowering && (
                <div className="level-progress">
                  {(() => {
                    const currentLevel = stats.level || 1;
                    const currentLevelInfo = getLevelInfo(currentLevel);
                    const nextLevelInfo = getLevelInfo(currentLevel + 1);
                    
                    // Determine how many sessions needed for next level
                    const sessionsNeeded = currentLevel <= 10 ? 1 : 
                                          currentLevel <= 20 ? 2 : 3;
                    
                    // Get the number of sessions since last level up
                    const sessions = getShowerSessions();
                    let sessionsAfterLastLevel = 0;
                    
                    if (stats.lastLevelUp) {
                      const lastLevelUpDate = new Date(stats.lastLevelUp);
                      sessionsAfterLastLevel = sessions.filter(
                        (session: LocalShowerSession) => new Date(session.createdAt) > lastLevelUpDate
                      ).length;
                    } else {
                      // If never leveled up before, count all sessions
                      sessionsAfterLastLevel = sessions.length;
                    }
                    
                    const progress = Math.min(100, Math.floor((sessionsAfterLastLevel / sessionsNeeded) * 100));
                    const showersNeeded = Math.max(0, sessionsNeeded - sessionsAfterLastLevel);
                    
                    return (
                      <>
                        <div className="flex flex-col items-center justify-center mb-2">
                          {/* Use the animated level indicator when leveling up, otherwise show the static one */}
                          {didLevelUp && newLevel ? (
                            <AnimatedLevelIndicator
                              previousLevel={currentLevel}
                              targetLevel={newLevel || currentLevel + 1}
                              isAnimating={showLevelAnimation}
                              onAnimationComplete={() => {
                                setShowLevelAnimation(false);
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-blue-100 px-4 py-1.5 rounded-full">
                                <span className="text-xl font-bold" style={{ color: currentLevelInfo.color }}>
                                  Level {currentLevel}
                                </span>
                              </div>
                              <span className="text-lg font-medium text-blue-600">•</span>
                              <span className="text-lg font-medium text-blue-600">
                                {currentLevelInfo.name}
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-gray-500 mb-1">
                            {showersNeeded} shower{showersNeeded !== 1 ? 's' : ''} to Level {currentLevel + 1}
                          </div>
                        </div>
                        <ProgressIndicator 
                          value={progress} 
                          color={currentLevelInfo.color}
                          label={`${sessionsAfterLastLevel} / ${sessionsNeeded} showers`} 
                          className="h-5"
                          animated={justCompletedShower} // Only animate when shower just completed
                        />
                      </>
                    );
                  })()}
                </div>
              )}
              {isShowering && (
                <div className="text-center text-sm text-green-600">
                  +50 points when done
                </div>
              )}
            </div>
            
            {!isShowering && (
              <Button 
                onClick={handleStart} 
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 mb-0 rounded-full text-xl"
              >
                Start Shower
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      

      {/* Removed "Your Progress" card as requested */}
      
      {/* Simple gift box - just the gift itself - no content visible */}
      {pendingLoot && !isShowering && !openedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div 
            className="w-56 h-56 bg-amber-300 rounded-xl shadow-xl cursor-pointer hover:scale-105 relative transition-transform animate-bounce-slow"
            onClick={() => handleOpenGift(pendingLoot)}
          >
            {/* Gift box with no visible content until opened */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-amber-400 rounded-t-xl"></div>
            <div className="absolute top-0 left-1/2 w-8 h-full bg-red-500 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-8 bg-red-500 transform -translate-y-1/2"></div>
            
            {/* Bow */}
            <div className="absolute top-0 left-1/2 w-20 h-16 transform -translate-x-1/2 -translate-y-4 z-10">
              <div className="absolute top-1/2 left-0 w-10 h-12 bg-red-500 rounded-full transform -translate-y-1/2 rotate-[-30deg] origin-right"></div>
              <div className="absolute top-1/2 right-0 w-10 h-12 bg-red-500 rounded-full transform -translate-y-1/2 rotate-[30deg] origin-left"></div>
              <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            
            {/* Small stars around the gift to make it more appealing */}
            <div className="absolute -top-3 -left-3 text-xl text-cyan-400">✨</div>
            <div className="absolute -bottom-2 -right-3 text-xl text-yellow-400">✨</div>
          </div>
        </div>
      )}
      
      {/* Opened gift box showing the treasure inside */}
      {openedItem && !isShowering && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-pink-100 p-8 rounded-2xl shadow-2xl animate-bounce-slow">
            <div className="text-9xl mb-4">{openedItem.emoji}</div>
            <h3 className="text-2xl font-bold text-purple-800 mb-1">{openedItem.name}</h3>
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium mb-3 uppercase text-xs tracking-wider">
              {openedItem.rarity}
            </div>
            <p className="text-center text-purple-600 mb-2">{openedItem.description}</p>
            <div className="mt-4 flex gap-3">
              <span className="text-2xl">✨</span>
              <span className="text-2xl">🎉</span>
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Test gift box for debugging - always visible */}
      {!isShowering && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={() => {
              // Show a test gift box 
              const testLoot = TEST_LOOT;
              storageSavePendingLoot(testLoot);
              setPendingLootState(testLoot);
            }}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Show Test Gift Box
          </Button>
        </div>
      )}
      
      {/* Simplified Treasures carousel with item counts and better scrolling */}
      {collectedItems.length > 0 && !isShowering && (
        <Card className="overflow-hidden border-2 border-pink-200 mt-1">
          <CardContent className="p-2">
            {/* Carousel with touch/swipe support */}
            <Carousel 
              className="w-full" 
              opts={{
                align: "start",
                loop: true,
                dragFree: true
              }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="-ml-2">
                {collectedItems.map((item, index) => (
                  <CarouselItem 
                    key={item.id + "-" + index} 
                    className="basis-1/4 sm:basis-1/5 md:basis-1/6 pl-2"
                    data-item-id={item.id}
                  >
                    <div className="relative text-center p-1">
                      <div className="text-5xl">{item.emoji}</div>
                      {/* Count badge - positioned to the top right of emoji */}
                      <div className="absolute top-0 right-1 bg-pink-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
                        {item.count}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center mt-1 mb-0">
                <CarouselPrevious className="relative h-6 w-6 mr-2" />
                <CarouselNext className="relative h-6 w-6 ml-2" />
              </div>
            </Carousel>
          </CardContent>
        </Card>
      )}
      
      {/* We've removed the modal completely, using only the carousel */}

      {/* Animating item from gift to carousel */}
      {itemAnimating && currentItem && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div 
            className="absolute transition-all duration-1000 ease-in-out transform"
            style={{
              top: itemPosition.top,
              left: itemPosition.left, 
              transition: "top 1.5s, left 1.5s",
              ...(!itemAnimating ? {} : {
                top: targetPosition.top,
                left: targetPosition.left
              }),
              animation: 'flyToTarget 1.5s forwards'
            }}
          >
            <div className="text-7xl">{currentItem.emoji}</div>
          </div>
        </div>
      )}
    </div>
  );
}
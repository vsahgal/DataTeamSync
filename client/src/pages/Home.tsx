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
import { getRandomLootItem, LootItem } from "@/lib/lootItems";
import GiftBox from "@/components/GiftBox";
import LootCollection from "@/components/LootCollection";

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
      
      // If there's no level-up in progress, show it right away
      if (!didLevelUp) {
        console.log("No level up - showing loot right away");
        storageSavePendingLoot(newLoot);
        setPendingLootState(newLoot);
      } else {
        // If there's a level-up, store the loot for later
        console.log("Level up - delaying loot until animations finish");
        setDelayedLoot(newLoot);
      }
    }, 3000);
    
    toast({
      title: "Shower completed!",
      description: `Great job! You earned ${earnedPoints} points.`,
      variant: "default",
    });
  };
  
  // Handle opening the gift box and collecting the loot
  const handleOpenGift = (item: LootItem) => {
    // Add the item to the collection
    const collectedItem = addCollectedLoot(item);
    
    // Update the state with the refreshed collection
    setCollectedItems(getCollectedLoot());
    
    // Clear the pending loot
    storageSavePendingLoot(null);
    setPendingLootState(null);
    
    // Show the collection after a short delay so user can see what they got
    setTimeout(() => {
      setShowLootCollection(true);
    }, 1000);
    
    // Show a celebration toast
    toast({
      title: `You found a ${item.rarity} item!`,
      description: `${item.name} ${item.emoji} has been added to your collection!`,
      variant: "default",
    });
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
  const [showLootCollection, setShowLootCollection] = useState(false);
  const [collectedItems, setCollectedItems] = useState(getCollectedLoot());
  const [delayedLoot, setDelayedLoot] = useState<LootItem | null>(null);
  
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
      console.log("Starting 5-second pause before showing gift");
      const timer = setTimeout(() => {
        console.log("Pause complete, showing gift");
        setPauseTimerActive(false);
        
        // If we had a delayed loot item, show it now
        if (delayedLoot) {
          storageSavePendingLoot(delayedLoot);
          setPendingLootState(delayedLoot);
          setDelayedLoot(null);
        }
      }, 5000); // 5 second pause before showing the gift
      return () => clearTimeout(timer);
    }
  }, [pauseTimerActive, delayedLoot]);

  return (
    <div className="flex flex-col gap-4 relative">
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
              <div className="text-center py-0 mb-4">
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
            
            <div className="w-full mt-1 mb-3">
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
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 mb-1 rounded-full text-xl"
              >
                Start Shower
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      

      <Card className="overflow-hidden border-2 border-indigo-200">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">Your Progress</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Droplets className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Showers</p>
                <p className="font-medium">{stats.totalSessions}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <Award className="text-purple-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="font-medium">{stats.streakDays} days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Zap className="text-yellow-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="font-medium">{stats.totalPoints}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <BarChart className="text-emerald-600 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Longest</p>
                <p className="font-medium">{Math.floor(stats.longestShower / 60)}:{(stats.longestShower % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
          
          {collectedItems.length > 0 && (
            <div className="mt-4">
              <Button 
                onClick={() => setShowLootCollection(true)} 
                variant="outline" 
                className="w-full"
              >
                <Gift className="mr-2 h-4 w-4" /> View Collection ({collectedItems.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Gift box for loot rewards - simpler implementation */}
      {pendingLoot && !isShowering && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <GiftBox 
            visible={true} // Always set true when component is rendered
            onOpen={handleOpenGift} 
            lootItem={pendingLoot} 
          />
        </div>
      )}
      
      {/* Loot collection modal */}
      <LootCollection
        items={collectedItems}
        isOpen={showLootCollection}
        onClose={() => setShowLootCollection(false)}
      />
    </div>
  );
}
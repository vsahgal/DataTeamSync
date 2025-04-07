import { useEffect, useState } from "react";
import LevelDisplay from "@/components/LevelDisplay";
import UnicornShower from "@/components/UnicornShower";
import DirtyUnicorn from "@/components/DirtyUnicorn";
import DancingUnicorn from "@/components/DancingUnicorn";
import LevelUpAnimation from "@/components/LevelUpAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useToast } from "@/hooks/use-toast";
import useShowerState from "@/hooks/useShowerState";
import { getShowerStats } from "@/lib/storage";
import { LEVELS } from "@/lib/constants";
import { Droplets, Zap, Award, BarChart } from "lucide-react";
import { ShowerStats } from "@shared/schema";
import Confetti from "react-confetti";

// Helper function to calculate days since last shower
const getDaysSinceLastShower = (lastShowerDate: string): number => {
  const lastDate = new Date(lastShowerDate);
  const today = new Date();
  
  // Reset time part to avoid partial day calculations
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

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
  
  useEffect(() => {
    setStats(getShowerStats());
  }, [isShowering]);
  
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
    toast({
      title: "Shower completed!",
      description: `Great job! You earned ${earnedPoints} points.`,
      variant: "default",
    });
  };
  
  // States for managing the level-up celebration sequence
  const [showLevelAnimation, setShowLevelAnimation] = useState(false);
  const [showDancingUnicorn, setShowDancingUnicorn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get current level information 
  const currentLevelInfo = LEVELS.find(l => l.level === stats.level) || LEVELS[0];
  
  // Manage the level-up celebration sequence
  useEffect(() => {
    if (didLevelUp && newLevel) {
      // Start the celebration sequence
      setShowConfetti(true);
      setShowLevelAnimation(true);
      
      // After level animation completes, show dancing unicorn
      setTimeout(() => {
        setShowDancingUnicorn(true);
        // Hide level animation
        setShowLevelAnimation(false);
      }, 2000);
      
      // After dancing unicorn completes, end the celebration
      setTimeout(() => {
        setShowDancingUnicorn(false);
        setShowConfetti(false);
        resetLevelUp(); // Reset the level-up state
      }, 5000);
    }
  }, [didLevelUp, newLevel, resetLevelUp]);

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
      
      {/* Dancing unicorn animation */}
      <DancingUnicorn 
        isVisible={showDancingUnicorn} 
        onAnimationComplete={() => setShowDancingUnicorn(false)}
      />
      
      {/* Level-up animation */}
      {newLevel && (
        <LevelUpAnimation 
          isVisible={showLevelAnimation}
          level={newLevel}
          color={LEVELS.find(l => l.level === newLevel)?.color || '#4299E1'}
          onAnimationComplete={() => setShowLevelAnimation(false)}
        />
      )}
      
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
                    const currentLevelInfo = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
                    const nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
                    
                    if (!nextLevelInfo) {
                      return (
                        <div className="text-center text-sm text-blue-600 mb-1">
                          Maximum level reached!
                        </div>
                      );
                    }
                    
                    const currentLevelPoints = currentLevelInfo.pointsNeeded;
                    const nextLevelPoints = nextLevelInfo.pointsNeeded;
                    const pointsDifference = nextLevelPoints - currentLevelPoints;
                    const pointsEarned = stats.totalPoints - currentLevelPoints;
                    const progress = Math.min(100, Math.floor((pointsEarned / pointsDifference) * 100));
                    const pointsNeeded = nextLevelPoints - stats.totalPoints;
                    
                    return (
                      <>
                        <div className="flex flex-col items-center justify-center mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="bg-blue-100 px-3 py-1 rounded-full">
                              <span className="text-lg font-bold" style={{ color: currentLevelInfo.color }}>
                                Level {currentLevel}
                              </span>
                            </div>
                            <span className="text-lg font-medium text-blue-600">•</span>
                            <span className="text-lg font-medium text-blue-600">
                              {currentLevelInfo.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {pointsNeeded} points to Level {currentLevel + 1}
                          </div>
                        </div>
                        <ProgressIndicator 
                          value={progress} 
                          color={currentLevelInfo.color}
                          label={`${stats.totalPoints} / ${nextLevelPoints} points`} 
                          className="h-5"
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
      
      {/* Level Display */}
      <LevelDisplay stats={stats} />

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
        </CardContent>
      </Card>
    </div>
  );
}
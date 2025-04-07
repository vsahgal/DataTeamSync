import { useEffect, useState } from "react";
import LevelDisplay from "@/components/LevelDisplay";
import UnicornShower from "@/components/UnicornShower";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { useToast } from "@/hooks/use-toast";
import useShowerState from "@/hooks/useShowerState";
import { getShowerStats } from "@/lib/storage";
import { LEVELS } from "@/lib/constants";
import { Droplets, Zap, Award, BarChart } from "lucide-react";
import { ShowerStats } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { 
    isShowering, 
    elapsedTime, 
    points, 
    startShower, 
    stopShower, 
    isWaterOn
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
      description: "Let's get clean and earn 10 points!",
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
  
  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-4 border-blue-300 bg-white">
        <CardContent className="p-0 relative">
          <div className="p-4 flex flex-col items-center justify-center relative z-10">
            <div className="flex justify-between items-center w-full mb-2">
              <h1 className="text-3xl font-bold text-blue-600">
                Zoya's Shower Time
              </h1>
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                Level {stats.level || 1}
              </div>
            </div>
            
            {/* Placeholder for non-showering state */}
            {!isShowering && (
              <div className="text-center py-0">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE2MCIgcng9IjgwIiByeT0iNjAiIGZpbGw9IiNGRkQ2RjYiLz4KICA8cmVjdCB4PSI5MCIgeT0iMjAwIiB3aWR0aD0iMTUiIGhlaWdodD0iNTAiIHJ4PSI3IiBmaWxsPSIjRkZENkY2IiAvPgogIDxyZWN0IHg9IjEyMCIgeT0iMjAwIiB3aWR0aD0iMTUiIGhlaWdodD0iNTUiIHJ4PSI3IiBmaWxsPSIjRkZENkY2IiAvPgogIDxyZWN0IHg9IjE2NSIgeT0iMjAwIiB3aWR0aD0iMTUiIGhlaWdodD0iNTUiIHJ4PSI3IiBmaWxsPSIjRkZENkY2IiAvPgogIDxyZWN0IHg9IjE5NSIgeT0iMjAwIiB3aWR0aD0iMTUiIGhlaWdodD0iNTAiIHJ4PSI3IiBmaWxsPSIjRkZENkY2IiAvPgogIDxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxMjAiIHJ4PSI0MCIgcnk9IjMwIiBmaWxsPSIjRkZENkY2Ii8+CiAgPGNpcmNsZSBjeD0iMjEwIiBjeT0iMTEwIiByPSI1IiBmaWxsPSJ3aGl0ZSIgLz4KICA8Y2lyY2xlIGN4PSIyMTAiIGN5PSIxMTAiIHI9IjIiIGZpbGw9IiMzMzMiIC8+CiAgPHBhdGggZD0iTTE5MCAxMjUgUTIwNSAxMzUgMjIwIDEyNSIgc3Ryb2tlPSIjMzMzIiBzdHJva2VXaWR0aD0iMiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0yMDUgOTAgTDIyMCA2MCIgc3Ryb2tlPSIjRkZCNkQ5IiBzdHJva2VXaWR0aD0iOCIgc3Ryb2tlTGluZWNhcD0icm91bmQiLz4KICA8ZWxsaXBzZSBjeD0iMTYwIiBjeT0iMTIwIiByeD0iMTIiIHJ5PSIyMCIgZmlsbD0iI0ZGQjZEOSIvPgogIDxlbGxpcHNlIGN4PSIxNDUiIGN5PSIxMjAiIHJ4PSIxMiIgcnk9IjIwIiBmaWxsPSIjQjVERUZGIi8+CiAgPGVsbGlwc2UgY3g9IjEzMCIgY3k9IjEyMCIgcng9IjEyIiByeT0iMjAiIGZpbGw9IiNEOUI1RkYiLz4KICA8ZWxsaXBzZSBjeD0iMTE1IiBjeT0iMTIwIiByeD0iMTIiIHJ5PSIyMCIgZmlsbD0iI0I1RkZEOSIvPgogIDxlbGxpcHNlIGN4PSIxMDAiIGN5PSIxMjAiIHJ4PSIxMiIgcnk9IjIwIiBmaWxsPSIjRkZCNkQ5Ii8+CiAgPHBhdGggZD0iTTcwIDE2MCBRNTAgMTIwIDcwIDgwIiBzdHJva2U9IiNGRkI2RDkiIHN0cm9rZVdpZHRoPSIxMCIgc3Ryb2tlTGluZWNhcD0icm91bmQiIGZpbGw9Im5vbmUiLz4KPC9zdmc+" 
                  alt="Unicorn waiting for shower"
                  className="mx-auto w-36 h-36 mt-0 mb-4" 
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
                        <div className="text-center text-sm text-blue-600 mb-1">
                          {pointsNeeded} points to Level {currentLevel + 1}
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
                  +10 points when done
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
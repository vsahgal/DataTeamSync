import React from 'react';
import { LEVELS } from '@/lib/constants';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useMemo } from 'react';
import { ShowerStats } from '@shared/schema';

interface LevelDisplayProps {
  stats: ShowerStats;
}

export default function LevelDisplay({ stats }: LevelDisplayProps) {
  const currentLevel = stats.level || 1;
  
  const levelInfo = useMemo(() => {
    const currentLevelInfo = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
    const nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
    
    // If there's no next level (max level reached)
    if (!nextLevelInfo) {
      return {
        currentLevel: currentLevelInfo,
        nextLevel: null,
        progress: 100,
        pointsNeeded: 0,
        pointsForNextLevel: 0
      };
    }
    
    const currentLevelPoints = currentLevelInfo.pointsNeeded;
    const nextLevelPoints = nextLevelInfo.pointsNeeded;
    const pointsDifference = nextLevelPoints - currentLevelPoints;
    const pointsEarned = stats.totalPoints - currentLevelPoints;
    const progress = Math.min(100, Math.floor((pointsEarned / pointsDifference) * 100));
    const pointsNeeded = nextLevelPoints - stats.totalPoints;
    
    return {
      currentLevel: currentLevelInfo,
      nextLevel: nextLevelInfo,
      progress,
      pointsNeeded,
      pointsForNextLevel: pointsDifference
    };
  }, [currentLevel, stats.totalPoints]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-blue-600">
            Level {currentLevel}: {levelInfo.currentLevel.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {levelInfo.nextLevel ? 
              `${levelInfo.pointsNeeded} points needed for Level ${currentLevel + 1}` : 
              'Maximum level reached!'}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center">
          {currentLevel}
        </div>
      </div>
      
      {levelInfo.nextLevel && (
        <div className="mt-2">
          <ProgressIndicator 
            value={levelInfo.progress} 
            color={levelInfo.currentLevel.color}
            label={`${stats.totalPoints} / ${levelInfo.nextLevel.pointsNeeded} points`} 
          />
        </div>
      )}
    </div>
  );
}
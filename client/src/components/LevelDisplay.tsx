import React from 'react';
import { LEVELS } from '@/lib/constants';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { useMemo } from 'react';
import { ShowerStats, LocalShowerSession } from '@shared/schema';
import { getShowerSessions } from '@/lib/storage';

interface LevelDisplayProps {
  stats: ShowerStats;
}

export default function LevelDisplay({ stats }: LevelDisplayProps) {
  const currentLevel = stats.level || 1;
  
  const levelInfo = useMemo(() => {
    const currentLevelInfo = LEVELS.find(l => l.level === currentLevel) || LEVELS[0];
    let nextLevelInfo = LEVELS.find(l => l.level === currentLevel + 1);
    
    // If there's no next level in our predefined levels, generate one
    if (!nextLevelInfo) {
      // Generate a name for the next level based on a pattern
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
      
      // Pick a name based on the current level (cycling through the options)
      const nameIndex = (currentLevel - LEVELS.length) % levelNames.length;
      
      // Generate colors by cycling through a rainbow pattern
      const hue = ((currentLevel - LEVELS.length) * 30) % 360;
      
      nextLevelInfo = {
        level: currentLevel + 1,
        name: levelNames[nameIndex],
        pointsNeeded: currentLevelInfo.pointsNeeded + 500,
        color: `hsl(${hue}, 80%, 60%)`,
        showersNeeded: 3 // All levels beyond the predefined ones need 3 showers
      };
    }
    
    // Calculate sessions since the last level up
    const sessions = getShowerSessions();
    let sessionsAfterLastLevel = 0;
    
    if (stats.lastLevelUp) {
      const lastLevelUpDate = new Date(stats.lastLevelUp);
      sessionsAfterLastLevel = sessions.filter(
        session => new Date(session.createdAt) > lastLevelUpDate
      ).length;
    } else {
      // If never leveled up before, count all sessions
      sessionsAfterLastLevel = sessions.length;
    }
    
    // Get showers needed for next level
    const showersNeeded = nextLevelInfo.showersNeeded;
    
    // Calculate progress
    const progress = Math.min(100, Math.floor((sessionsAfterLastLevel / showersNeeded) * 100));
    const showersRemaining = showersNeeded - sessionsAfterLastLevel;
    
    return {
      currentLevel: currentLevelInfo,
      nextLevel: nextLevelInfo,
      progress,
      showersCompleted: sessionsAfterLastLevel,
      showersNeeded,
      showersRemaining
    };
  }, [currentLevel, stats.lastLevelUp]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-blue-600">
            Level {currentLevel}: {levelInfo.currentLevel.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {levelInfo.showersRemaining > 0 ? 
              `${levelInfo.showersRemaining} more ${levelInfo.showersRemaining === 1 ? 'shower' : 'showers'} needed for Level ${currentLevel + 1}` : 
              `Ready to level up to Level ${currentLevel + 1}!`
            }
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
            label={`${levelInfo.showersCompleted} / ${levelInfo.showersNeeded} ${levelInfo.showersNeeded === 1 ? 'shower' : 'showers'}`} 
          />
        </div>
      )}
      
      {/* Show explanation of leveling system */}
      <div className="mt-3 text-xs text-gray-500">
        <p>Leveling System:</p>
        <ul className="list-disc list-inside pl-2">
          <li>Levels 1-10: 1 shower per level</li>
          <li>Levels 11-20: 2 showers per level</li>
          <li>Levels 21+: 3 showers per level</li>
        </ul>
      </div>
    </div>
  );
}
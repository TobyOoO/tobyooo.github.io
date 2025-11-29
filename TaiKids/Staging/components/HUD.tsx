
import React, { useState, useEffect } from 'react';
import stateManager, { GameFlow } from '../game/managers/StateManager';
import { INITIAL_WEEK, INITIAL_ACADEMIC_SCORE, INITIAL_MONEY } from '../game/constants';

const HUD: React.FC = () => {
  // Real-time stats from Player
  const [stats, setStats] = useState({ 
    hungriness: 100, 
    tValue: 100, 
    money: INITIAL_MONEY, 
    week: INITIAL_WEEK,
    academicScore: INITIAL_ACADEMIC_SCORE
  });

  // Delayed stats for visual display (to sync with StateUpdate animation)
  const [displayedStats, setDisplayedStats] = useState({
      academicScore: INITIAL_ACADEMIC_SCORE,
      week: INITIAL_WEEK,
      money: INITIAL_MONEY
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: any) => {
       if (e.detail) {
         setStats(prev => ({ ...prev, ...e.detail }));
         
         // On initialization, sync displayed stats immediately
         if (e.detail.source === 'init') {
             setDisplayedStats({
                 academicScore: e.detail.academicScore,
                 week: e.detail.week,
                 money: e.detail.money
             });
         }
       }
    };
    
    // Subscribe to state changes to trigger visual updates
    const unsubscribe = stateManager.subscribe((newState) => {
        setIsUpdating(newState === GameFlow.State.StateUpdate);
    });

    window.addEventListener('player-stats-update', handleUpdate);
    return () => {
        window.removeEventListener('player-stats-update', handleUpdate);
        unsubscribe();
    };
  }, []);

  // Sync displayed stats when entering StateUpdate (delayed to match animation)
  useEffect(() => {
      if (isUpdating) {
          const timer = setTimeout(() => {
              setDisplayedStats({
                  academicScore: stats.academicScore,
                  week: stats.week,
                  money: stats.money
              });
          }, 500); // Change text halfway through the twist
          return () => clearTimeout(timer);
      }
  }, [isUpdating, stats.academicScore, stats.week, stats.money]);

  const getRanking = (score: number) => {
      if (score < 40) return { label: '差生', color: 'text-gray-400', border: 'border-gray-500' };
      if (score < 70) return { label: '不上不下', color: 'text-yellow-400', border: 'border-yellow-400' };
      return { label: '拔尖生', color: 'text-purple-400', border: 'border-purple-400' };
  };

  const ranking = getRanking(displayedStats.academicScore);
  
  // Show ranking ONLY during StateUpdate and if we have at least finished the first week (week > 1 implies we have a score)
  const showRanking = isUpdating && displayedStats.week > 1;

  // Styles for positioning
  const baseClasses = "absolute z-20 flex flex-col gap-3 w-32 pointer-events-none transition-all duration-700 ease-in-out";
  
  // When updating: Center horizontal, move to bottom 25% (top-3/4), scale up 1.5x
  const updateClasses = "top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150 p-4 bg-black/50 rounded-lg backdrop-blur-sm border-2 border-white";
  
  // Normal: Top Right
  const normalClasses = "top-4 right-4";

  return (
    <div className={`${baseClasses} ${isUpdating ? updateClasses : normalClasses}`}>
        <div className="flex flex-col gap-1 transition-all duration-300">
             <div className="flex justify-between items-end">
                <span className="text-[12px] text-white text-shadow-m uppercase tracking-wider text-border">飽足感</span>
                <span className="text-[12px] text-yellow-400 font-pixel">第{displayedStats.week}週</span>
             </div>
            <div className="relative w-full h-4 bg-gray-700 border border-white">
                <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${stats.hungriness < 40 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                    style={{ width: `${stats.hungriness}%` }}
                />
            </div>
        </div>
        <div className="flex flex-col gap-1 transition-all duration-300">
            <span className="text-[12px] text-white text-shadow-m uppercase tracking-wider text-border">Ｔ值</span>
            <div className="relative w-full h-4 bg-gray-700 border border-white">
                <div 
                    className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${stats.tValue}%` }}
                />
            </div>
        </div>

        {/* Academic Ranking Badge - Only visible during update */}
        <div 
            className={`transition-all duration-300 ${showRanking ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}
            style={{ perspective: '1000px' }}
        >
            <div 
                style={{
                    transform: isUpdating ? 'rotateX(360deg) scale(1.1)' : 'rotateX(0deg)',
                    transition: 'transform 1s ease-in-out'
                }}
                className={`bg-zinc-800 border-2 ${ranking.border} p-1 text-center shadow-lg backface-visible`}
            >
                 <div className="text-[10px] text-gray-500 mb-0.5 leading-none">學業表現</div>
                 <span className={`text-sm ${ranking.color} font-pixel leading-tight block`}>
                     {ranking.label}
                 </span>
            </div>
        </div>

        <div className="flex flex-col gap-1 transition-all duration-300">
            <div className="bg-zinc-800 border-2 border-white p-1 text-right">
                <span className="text-xs text-yellow-400 block font-pixel leading-tight transition-all duration-300">
                    {displayedStats.money} 羊
                </span>
            </div>
        </div>
    </div>
  );
};

export default HUD;

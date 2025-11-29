
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import InRoomStage from './stages/InRoomStage';
import LessonStage from './stages/LessonStage';
import EndingTellingStage from './stages/EndingTellingStage';
import OnboardingStage from './stages/OnboardingStage';
import stateManager, { GameFlow } from './game/managers/StateManager';
import { INITIAL_WEEK, ASSET_VERSION } from './game/constants';
import LoadingScreen from './components/LoadingScreen';

// Asset Imports for Preloading
import { ASSETS } from './game/config/assetConfig';
import { QUIZ_LESSONS } from './Lessons/Quiz/constants';
import { ENDING_STORIES } from './game/data/endingData';
import { VENDING_ITEMS } from './components/GameModals/VendingMachineModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameFlow.State>(stateManager.state);
  const [currentWeek, setCurrentWeek] = useState(INITIAL_WEEK);
  const [currentEndingData, setCurrentEndingData] = useState<any | null>(null);

  // Loading & Start State
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Cheat Code
  useEffect(() => {
    (window as any).cheatJumpToWeek = (week: number) => {
        window.dispatchEvent(new CustomEvent('cmd-cheat-set-week', { detail: { week } }));
        console.log(`Cheated: Jumped to Week ${week}`);
    };
  }, []);

  // System Reset Handler
  useEffect(() => {
    const handleSystemReset = () => {
         // 1. Reset App State
         setIsLoading(true);
         setHasStarted(false);
         setLoadProgress(0);
         setCurrentWeek(INITIAL_WEEK);
         setCurrentEndingData(null);
         
         // 2. Reset Global State Manager
         stateManager.setState(GameFlow.State.Onboarding);
         
         // 3. Trigger Preload Again
         setResetKey(prev => prev + 1);
    };

    window.addEventListener('cmd-system-reset', handleSystemReset);
    return () => window.removeEventListener('cmd-system-reset', handleSystemReset);
  }, []);

  useEffect(() => {
    return stateManager.subscribe((newState) => {
        setGameState(newState);
        // Removed auto-save here to avoid race condition with stats update
    });
  }, []);

  // Save on unload or visibility change (mobile friendly)
  useEffect(() => {
      const handleSave = () => {
          window.dispatchEvent(new CustomEvent('cmd-save-game'));
      };

      // Standard unload
      window.addEventListener('beforeunload', handleSave);
      
      // Mobile background/tab switch
      const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
              handleSave();
          }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
          window.removeEventListener('beforeunload', handleSave);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
  }, []);

  useEffect(() => {
    const handleStats = (e: any) => {
        if (e.detail && typeof e.detail.week === 'number') {
            setCurrentWeek(e.detail.week);
        }
    };

    const handleStartEnding = (e: any) => {
        if (e.detail && e.detail.id) {
            setCurrentEndingData(e.detail);
        }
    };

    window.addEventListener('player-stats-update', handleStats);
    window.addEventListener('cmd-start-ending', handleStartEnding);
    return () => {
        window.removeEventListener('player-stats-update', handleStats);
        window.removeEventListener('cmd-start-ending', handleStartEnding);
    };
  }, []);

  // Asset Preloading Logic
  useEffect(() => {
    const preloadAssets = async () => {
        const imageUrls: string[] = [];

        // 1. Phaser Assets
        // Preload ALL player variants to ensure availability
        imageUrls.push(ASSETS.SPRITES.PLAYER_VARIANTS.MALE.URL);
        imageUrls.push(ASSETS.SPRITES.PLAYER_VARIANTS.FEMALE.URL);
        imageUrls.push(ASSETS.SPRITES.PLAYER_VARIANTS.NEUTRAL.URL);
        imageUrls.push(ASSETS.SPRITES.UI.URL);
        Object.values(ASSETS.TILES).forEach(tile => imageUrls.push(tile.URL));

        // 2. Quiz Images
        Object.values(QUIZ_LESSONS).forEach(lesson => {
            lesson.question_sets.forEach(q => {
                if (q.question_picture_url) imageUrls.push(q.question_picture_url);
            });
        });
        // Quiz matrix helper
        imageUrls.push(`https://t.oby.tw/static/assets/quiz/matrix.png?version=${ASSET_VERSION}`);

        // 3. Ending Images
        ENDING_STORIES.forEach(story => {
             imageUrls.push(`https://t.oby.tw/static/assets/endings/${story.id}-min.png?version=${ASSET_VERSION}`);
        });

        // 4. Vending Machine Items
        VENDING_ITEMS.forEach(item => {
            imageUrls.push(`https://t.oby.tw/static/assets/vending-machine/icon_${item.id}.png?version=${ASSET_VERSION}`);
        });

        // 5. Fonts (Naive check)
        const totalItems = imageUrls.length + 1; // +1 for fonts
        let loadedCount = 0;

        const incrementProgress = () => {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / totalItems) * 100));
        };

        const imagePromises = imageUrls.map(url => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = url;
                img.onload = () => { incrementProgress(); resolve(); };
                img.onerror = () => { 
                    console.warn(`Failed to preload: ${url}`); 
                    incrementProgress(); 
                    resolve(); 
                };
            });
        });

        // Font Loading
        const fontPromise = document.fonts.ready.then(() => {
            incrementProgress();
        });

        await Promise.all([...imagePromises, fontPromise]);

        // Add a small artificial delay for UX smoothness if it loaded too fast
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    preloadAssets();
  }, [resetKey]);

  return (
    <>
      {!hasStarted && (
          <LoadingScreen 
            progress={loadProgress} 
            isLoading={isLoading} 
            onStart={() => setHasStarted(true)}
          />
      )}
      
      {hasStarted && (
        <div className="relative w-full h-full min-h-screen bg-zinc-900 text-white font-pixel overflow-hidden animate-in fade-in duration-1000">
          
          {gameState === GameFlow.State.Onboarding && <OnboardingStage />}

          {/* InRoomStage is always mounted in background if not onboarding, to preserve Phaser context */}
          {(gameState !== GameFlow.State.Onboarding) && (
             <div className="absolute inset-0 w-full h-full">
                <InRoomStage />
             </div>
          )}
          
          {gameState === GameFlow.State.Lesson && <LessonStage currentWeek={currentWeek} />}
          
          {gameState === GameFlow.State.EndingTelling && currentEndingData && (
              <EndingTellingStage endingData={currentEndingData} />
          )}
        </div>
      )}
    </>
  );
};

export default App;

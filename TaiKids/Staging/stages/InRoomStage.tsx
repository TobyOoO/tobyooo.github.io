
import React, { useState, useEffect, useRef } from 'react';
import PhaserGame from '../game/PhaserGame';
import stateManager, { GameFlow } from '../game/managers/StateManager';
import HUD from '../components/HUD';
import { StageTitle } from '../components/StageUI';
import { GAME_FLOW_CONFIG, GenderText } from '../game/data/gameConfig';
import { determineEndingId, EndingHistoryItem } from '../game/data/endingData';
import { 
    BookShelfModal, 
    DeskModal, 
    BedModal, 
    ComputerModal, 
    ExitModal, 
    VendingMachineModal,
    DefaultModal,
    StoryDialog,
    VendingItem
} from '../components/GameModals';
import { LessonResult } from '../Lessons/PixelEssayGame/types';
import { ASSET_VERSION } from '../game/constants';
import { StoryHistoryItem, ChatHistoryItem } from '../game/entities/PlayerStats';
import { Gender } from '../components/GameModals/NamePicker';
import SaveManager from '../game/managers/SaveManager';

const InRoomStage: React.FC = () => {
  const [activeInteraction, setActiveInteraction] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameFlow.State>(stateManager.state);
  
  // Initialize Stats from SaveManager if available
  const [playerStats, setPlayerStats] = useState<{ 
      hungriness: number; 
      tValue: number; 
      money: number; 
      closeness: number;
      academicHistory: LessonResult[];
      storyHistory: StoryHistoryItem[];
      endingHistory: EndingHistoryItem[];
      chatHistory: Record<string, ChatHistoryItem>;
      latestEndingWeek: number;
      week: number;
      academicScore: number;
  }>(() => {
      const defaultStats = { 
          hungriness: 100, 
          tValue: 100, 
          money: 100, 
          closeness: 0, 
          academicHistory: [], 
          storyHistory: [], 
          endingHistory: [],
          chatHistory: {},
          latestEndingWeek: 0,
          week: 1,
          academicScore: 0
      };

      try {
          const savedData = SaveManager.load();
          if (savedData) {
              // Migrate legacy storyHistory (string[]) to objects
              if (savedData.storyHistory && Array.isArray(savedData.storyHistory)) {
                  savedData.storyHistory = savedData.storyHistory.map((item: any, index: number) => {
                      if (typeof item === 'string') {
                          return { week: index + 1, content: item };
                      }
                      return item;
                  });
              }
              // Merge saved data with defaults to ensure all fields exist
              return { ...defaultStats, ...savedData };
          }
      } catch (e) {
          console.warn("Failed to load save in InRoomStage", e);
      }
      return defaultStats;
  });

  const [playerGender, setPlayerGender] = useState<Gender>('male');

  useEffect(() => {
    try {
        const savedData = SaveManager.load();
        if (savedData?.persona?.gender) {
            setPlayerGender(savedData.persona.gender);
        }
    } catch(e) {}
  }, []);
  
  const [showStory, setShowStory] = useState<React.ReactNode | null>(null);
  
  // Pending transactions/updates to be applied after Story Dialog closes
  const [pendingTx, setPendingTx] = useState<{ cost: number; hungerGain: number; tValueGain: number } | null>(null);
  const [pendingLesson, setPendingLesson] = useState<any | null>(null);
  
  // Pending post-ending actions
  const [pendingWalkToComputer, setPendingWalkToComputer] = useState(false);

  const [isSleeping, setIsSleeping] = useState(false);

  // Refs for state accessible in closures/effects without re-triggering
  const playerStatsRef = useRef(playerStats);
  useEffect(() => { playerStatsRef.current = playerStats; }, [playerStats]);

  const pendingLessonRef = useRef(pendingLesson);
  useEffect(() => { pendingLessonRef.current = pendingLesson; }, [pendingLesson]);

  const playerGenderRef = useRef(playerGender);
  useEffect(() => { playerGenderRef.current = playerGender; }, [playerGender]);

  // Timer ref for cleaning up on unmount
  const stateUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to resolve GenderText
  const getGenderedText = (content: GenderText, gender: Gender): string => {
      if (typeof content === 'string') return content;
      if (gender === 'male' && content.male) return content.male;
      if (gender === 'female' && content.female) return content.female;
      return content.neutral || content.male || "";
  };

  // 1. Handle State Transitions
  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = stateManager.subscribe((newState) => {
        setGameState(newState);
        
        if (newState === GameFlow.State.StateUpdate) {
            // Close any active modals if we enter update mode
            setActiveInteraction(null);

            // Clear any existing timer just in case
            if (stateUpdateTimerRef.current) clearTimeout(stateUpdateTimerRef.current);

            // Revert back to InRoom after 5 seconds
            stateUpdateTimerRef.current = setTimeout(() => {
                if (stateManager.is(GameFlow.State.StateUpdate)) {
                    stateManager.setState(GameFlow.State.InRoom);
                    // Auto-save game after update animation completes and stats are settled
                    window.dispatchEvent(new CustomEvent('cmd-save-game'));
                }
            }, 5000);
        } else if (newState === GameFlow.State.StoryTelling) {
             // Dispatch command to walk to computer
             window.dispatchEvent(new CustomEvent('cmd-move-player-to', { detail: { id: 'computer' } }));
             
             // Wait for arrival before showing dialog
             const onArrival = () => {
                 let content: GenderText | null = null;
                 
                 // If we have a buffered lesson result, use its story
                 if (pendingLessonRef.current) {
                     content = pendingLessonRef.current.story;
                 } else {
                     // Fallback mechanism (should rarely happen if flow is correct)
                     const currentWeek = playerStatsRef.current.week;
                     
                     if (currentWeek >= 13) {
                         content = "你開始不確定到底還要多久才能離開這裡。";
                     } else {
                         const lessonCount = GAME_FLOW_CONFIG.lessons.length;
                         // Logic: If lesson isn't applied yet, we are still in currentWeek.
                         // The lesson we just played matches currentWeek index (0-based) = week - 1
                         const lessonIndex = (currentWeek - 1) % lessonCount;
                         content = GAME_FLOW_CONFIG.lessons[lessonIndex].storyDialog;
                     }
                 }

                 if (content) {
                    const resolvedStory = getGenderedText(content, playerGenderRef.current);
                    
                    // Update pendingLesson with resolved string so PlayerStats saves the correct text
                    if (pendingLessonRef.current) {
                        setPendingLesson((prev: any) => ({ ...prev, story: resolvedStory }));
                    }
                    setShowStory(resolvedStory);
                 }
                 window.removeEventListener('player-arrived', onArrival);
             };
             window.addEventListener('player-arrived', onArrival);
        }
    });

    return () => {
        unsubscribe();
        // Clean up timeout on unmount or if effect re-runs (which it shouldn't often now due to empty deps)
        if (stateUpdateTimerRef.current) clearTimeout(stateUpdateTimerRef.current);
    };
  }, []); // Empty dependency array to prevent effect re-runs on state changes (timer preservation)

  // 2. Listen for Player Stats & buffered events
  useEffect(() => {
    const handleStatsUpdate = (e: any) => {
       if (e.detail) {
         setPlayerStats(prev => ({ ...prev, ...e.detail }));
       }
    };

    const handleLessonBuffer = (e: any) => {
        setPendingLesson(e.detail);
    };
    
    const handleEndingFeedback = (e: CustomEvent) => {
        if (e.detail && e.detail.success) {
            // If it's a new unlock, prompt to check album. Otherwise, hint to try again.
            if (e.detail.isNew) {
                setShowStory("你電腦裡的相簿解鎖了一張新的照片。");
                setPendingWalkToComputer(true);
            } else {
                setShowStory("也許還有別的離開這裡的方法⋯⋯");
            }
        }
    };
    
    const handleTutorial = () => {
        setShowStory("你可以點擊地板來移動，也可以使用方向鍵或WASD移動。\n按一下房間裡的夥伴們來互動。\n房間門口在下方。");
    };
    
    // Listen for Save Game command from Computer
    const handleSaveGame = () => {
        try {
            const currentStats = playerStatsRef.current;
            
            // Retrieve existing persona to preserve it
            const savedData = SaveManager.load();
            const existingPersona = savedData?.persona || {};

            const savePayload = {
                persona: existingPersona,
                hungriness: Number(currentStats.hungriness || 0),
                tValue: Number(currentStats.tValue || 0),
                money: Number(currentStats.money || 0),
                closeness: Number(currentStats.closeness || 0),
                week: Number(currentStats.week || 1),
                academicScore: Number(currentStats.academicScore || 0),
                latestEndingWeek: Number(currentStats.latestEndingWeek || 0),
                
                storyHistory: Array.isArray(currentStats.storyHistory) 
                    ? [...currentStats.storyHistory] 
                    : [],
                
                academicHistory: Array.isArray(currentStats.academicHistory) 
                    ? currentStats.academicHistory.map(r => ({
                        id: Number(r.id),
                        name: String(r.name),
                        score: Number(r.score),
                        failed: Array.isArray(r.failed) ? [...r.failed] : [],
                        lessonComment: String(r.lessonComment),
                        week: r.week
                    })) 
                    : [],
                
                endingHistory: Array.isArray(currentStats.endingHistory) 
                    ? currentStats.endingHistory.map(h => ({
                        id: String(h.id),
                        timestamp: Number(h.timestamp),
                        week: Number(h.week),
                        tValue: Number(h.tValue),
                        academicRanking: String(h.academicRanking)
                    })) 
                    : [],
                    
                chatHistory: currentStats.chatHistory || {}
            };
            
            // Explicitly cast to any to satisfy SaveManager's expected input which might be strict about Persona
            SaveManager.save(savePayload as any);
            console.log('Game Saved via SaveManager');
        } catch (err) {
            console.error('Failed to save game', err);
        }
    };

    window.addEventListener('player-stats-update', handleStatsUpdate);
    window.addEventListener('cmd-buffer-lesson-result', handleLessonBuffer);
    window.addEventListener('cmd-save-game', handleSaveGame);
    window.addEventListener('cmd-ending-feedback', handleEndingFeedback as EventListener);
    window.addEventListener('cmd-show-tutorial', handleTutorial);
    
    return () => {
        window.removeEventListener('player-stats-update', handleStatsUpdate);
        window.removeEventListener('cmd-buffer-lesson-result', handleLessonBuffer);
        window.removeEventListener('cmd-save-game', handleSaveGame);
        window.removeEventListener('cmd-ending-feedback', handleEndingFeedback as EventListener);
        window.removeEventListener('cmd-show-tutorial', handleTutorial);
    };
  }, []);

  // 3. Handle Interaction Events from Phaser
  useEffect(() => {
    const handleInteraction = (e: any) => {
      const interactionId = e.detail.id;
      setActiveInteraction(interactionId);
      stateManager.setState(GameFlow.State.Interaction);
    };

    window.addEventListener('game-interaction', handleInteraction);
    return () => window.removeEventListener('game-interaction', handleInteraction);
  }, []);

  // 4. Idle Timer
  useEffect(() => {
      let idleTimer: ReturnType<typeof setTimeout>;

      // Only run timer if we are in the room, not interacting, not showing story, not sleeping
      if (gameState === GameFlow.State.InRoom && !activeInteraction && !showStory && !isSleeping) {
          idleTimer = setTimeout(() => {
              setShowStory("媽媽在喊，你該去上學了");
          }, 120000);
      }

      return () => {
          if (idleTimer) clearTimeout(idleTimer);
      };
  }, [gameState, activeInteraction, showStory, isSleeping]);

  const closeInteraction = () => {
      setActiveInteraction(null);
      if (stateManager.is(GameFlow.State.Interaction)) {
          stateManager.setState(GameFlow.State.InRoom);
      }
  };

  const handleSleep = () => {
      setIsSleeping(true);
      setTimeout(() => {
          window.dispatchEvent(new CustomEvent('cmd-consume-hunger', { 
              detail: { amount: -25 } 
          }));
          setIsSleeping(false);
      }, 2000);
  };

  const handleGoToSchool = () => {
      stateManager.setState(GameFlow.State.Lesson);
  };
  
  const handleLeave = () => {
      const eid = determineEndingId(playerStats.tValue, playerStats.academicScore, playerStats.closeness);
      
      // Determine Ranking Label
      let rankingLabel = '拔尖生';
      if (playerStats.academicScore < 40) rankingLabel = '差生';
      else if (playerStats.academicScore < 70) rankingLabel = '不上不下';

      // Dispatch event to initiate ending sequence (App.tsx will pick this up and show EndingTellingStage)
      // Note: Actual unlocking (adding to history) happens in EndingTellingStage after verification
      window.dispatchEvent(new CustomEvent('cmd-start-ending', { 
          detail: {
              id: eid,
              tValue: playerStats.tValue,
              academicScore: playerStats.academicScore,
              closeness: playerStats.closeness,
              week: playerStats.week,
              academicRanking: rankingLabel
          }
      }));

      stateManager.setState(GameFlow.State.EndingTelling);
      setActiveInteraction(null);
  };

  const handleUpdateCloseness = (delta: number) => {
      window.dispatchEvent(new CustomEvent('cmd-update-closeness', { detail: { amount: delta } }));
  };

  const handleBuy = (items: VendingItem[]) => {
      const totalCost = items.reduce((acc, item) => acc + item.price, 0);
      const totalHungerGain = items.reduce((acc, item) => acc + item.hungriness, 0);
      const totalTValueGain = items.reduce((acc, item) => acc + item.tValue, 0);

      const content = (
          <div>
              <p className="mb-4">你吃了...</p>
              <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                  {items.map((item) => (
                      <div key={item.id} className="flex flex-col items-center min-w-[60px] animate-in slide-in-from-bottom-2 duration-500">
                           <img 
                              src={`https://t.oby.tw/static/assets/vending-machine/icon_${item.id}.png?version=${ASSET_VERSION}`}
                              alt={item.name}
                              className="w-12 h-12 mb-1"
                              style={{imageRendering: 'pixelated'}}
                          />
                          <span className="text-[10px] text-gray-300 text-center leading-tight">{item.name}</span>
                      </div>
                  ))}
              </div>
          </div>
      );
      
      setPendingTx({
          cost: totalCost,
          hungerGain: totalHungerGain,
          tValueGain: totalTValueGain
      });
      
      setShowStory(content);
  };

  const closeStory = () => {
      setShowStory(null);
      
      let shouldUpdateState = false;

      // Apply Vending Machine Transaction
      if (pendingTx) {
          window.dispatchEvent(new CustomEvent('cmd-buy-item', {
              detail: pendingTx
          }));
          setPendingTx(null);
          shouldUpdateState = true;
      }

      // Apply Lesson Result (Hunger deducted here, syncs with StateUpdate start)
      if (pendingLesson) {
          window.dispatchEvent(new CustomEvent('cmd-complete-lesson', {
              detail: pendingLesson
          }));
          setPendingLesson(null);
          shouldUpdateState = true;
      }
      
      // Post-Ending Walk to Computer
      if (pendingWalkToComputer) {
          setPendingWalkToComputer(false);
          window.dispatchEvent(new CustomEvent('cmd-move-player-to', { detail: { id: 'computer' } }));
          
          const onArrive = () => {
               window.dispatchEvent(new CustomEvent('cmd-face-direction', { detail: { dir: 'down' } }));
               window.removeEventListener('player-arrived', onArrive);
          };
          window.addEventListener('player-arrived', onArrive);
      }

      // If we are currently in StoryTelling state (which implies a flow transition needed)
      // or if we have pending updates to process via StateUpdate animation
      if (shouldUpdateState || stateManager.is(GameFlow.State.StoryTelling)) {
          stateManager.setState(GameFlow.State.StateUpdate);
      }
  };

  const renderModal = () => {
      if (stateManager.is(GameFlow.State.StateUpdate)) return null;
      if (!activeInteraction) return null;

      switch (activeInteraction) {
          case 'book-shelf':
              return <BookShelfModal onClose={closeInteraction} academicHistory={playerStats.academicHistory} />;
          case 'desk':
              return <DeskModal 
                  onClose={closeInteraction} 
                  storyHistory={playerStats.storyHistory} 
                  gender={playerGender}
              />;
          case 'bed':
              return <BedModal onClose={closeInteraction} onConfirm={handleSleep} />;
          case 'computer':
              return <ComputerModal 
                  onClose={closeInteraction} 
                  currentWeek={playerStats.week}
                  gender={playerGender}
                  playerCloseness={playerStats.closeness}
                  onUpdateCloseness={handleUpdateCloseness}
                  endingHistory={playerStats.endingHistory}
                  chatHistory={playerStats.chatHistory}
              />;
          case 'exit':
              return <ExitModal 
                  onClose={closeInteraction} 
                  currentHungriness={playerStats.hungriness}
                  onGoToSchool={handleGoToSchool}
                  onLeave={handleLeave}
                  hasLeftThisWeek={playerStats.latestEndingWeek === playerStats.week}
              />;
          case 'vending-machine':
              return <VendingMachineModal 
                onClose={closeInteraction} 
                currentMoney={playerStats.money} 
                onBuy={handleBuy}
              />;
          default:
              return <DefaultModal id={activeInteraction} onClose={closeInteraction} />;
      }
  };

  return (
    <>
      <div 
          className={`fixed inset-0 z-[200] bg-black pointer-events-none transition-opacity duration-1000 ease-in-out ${isSleeping ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Input Blocker for Story Dialog - z-40 */}
      {showStory && <div className="fixed inset-0 z-40" />} 

      <StageTitle title="" />
      
      <div className="relative z-10 nes-container is-dark is-rounded p-0 overflow-hidden" style={{ padding: 0, border: '4px solid white' }}>
        <PhaserGame />
      </div>

      {/* Moved modals outside the z-10 container to prevent z-index stacking context issues */}
      {renderModal()}
      {showStory && <StoryDialog content={showStory} onClose={closeStory} />}

      <HUD />
      
    </>
  );
};

export default InRoomStage;

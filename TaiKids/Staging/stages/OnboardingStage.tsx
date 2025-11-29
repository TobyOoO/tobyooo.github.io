
import React, { useState, useEffect } from 'react';
import { ASSETS } from '../game/config/assetConfig';
import StoryDialog from '../components/GameModals/StoryDialog';
import NamePicker, { Gender } from '../components/GameModals/NamePicker';
import stateManager, { GameFlow } from '../game/managers/StateManager';
import SaveManager, { GameSaveData } from '../game/managers/SaveManager';
import { INITIAL_WEEK, INITIAL_MONEY, INITIAL_ACADEMIC_SCORE, INITIAL_HUNGRINESS, INITIAL_T_VALUE, INITIAL_CLOSENESS, ASSET_VERSION } from '../game/constants';

const OnboardingStage: React.FC = () => {
  const [checkingSave, setCheckingSave] = useState(true);
  const [step, setStep] = useState<'gender' | 'name' | 'intro'>('gender');
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  
  // Dialog State
  const [showGenderPrompt, setShowGenderPrompt] = useState(true);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [introContent, setIntroContent] = useState<string | null>(null);

  // Transition State
  const [isFashing, setIsFlashing] = useState(false);

  // Check for existing save
  useEffect(() => {
      if (SaveManager.hasSave()) {
          console.log('[Onboarding] Found existing save, skipping to InRoom.');
          stateManager.setState(GameFlow.State.InRoom);
      } else {
          SaveManager.clear();
          setCheckingSave(false);
      }
  }, []);

  // --- Handlers ---

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
    setShowNamePrompt(true);
  };

  const handleGenderConfirm = () => {
      setShowNamePrompt(false);
      setStep('name');
  };

  const handleNameComplete = (fullName: string) => {
      if (!selectedGender) return;

      // Track GTM Event
      try {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
              event: 'PlayerGender',
              gender: selectedGender,
              version: ASSET_VERSION
          });
      } catch (e) {
          console.warn('GTM Error', e);
      }
      
      const introText = `2008年夏天——\n\n你，${fullName}，剛告別島上的國小同學們，\n隨著父母到遙遠口國展開新生活。\n不在學校的時間，你在這個房間和你的電腦相依為命。\n房間還有床、書櫃、書桌陪伴你的寂寞、記錄你的生活。\n爸媽都忙，每週給你 10 羊，記得自己買東西填飽肚子。\n\n時間到了記得去上學。\n這是一間口國的私人學校，好好學習。\n課業之餘，別忘了多交朋友。\n\n你的目標是在忘記自己之前，回到故鄉。`;
      
      setIntroContent(introText);
      setStep('intro');
      
      // Save data immediately but only trigger transition when dialog closes
      const initialSaveData: GameSaveData = {
          persona: {
              gender: selectedGender,
              name: fullName
          },
          hungriness: INITIAL_HUNGRINESS,
          tValue: INITIAL_T_VALUE,
          money: INITIAL_MONEY,
          closeness: INITIAL_CLOSENESS,
          week: INITIAL_WEEK,
          academicScore: INITIAL_ACADEMIC_SCORE,
          latestEndingWeek: 0,
          academicHistory: [],
          storyHistory: [],
          endingHistory: [],
          chatHistory: {},
          justCreated: true // Flag to trigger Hurt animation in MainScene
      };
      
      SaveManager.save(initialSaveData);
  };

  const handleIntroComplete = () => {
      // Trigger Visual Transition
      setIntroContent(null);
      setIsFlashing(true);
      
      setTimeout(() => {
          // Switch State
          stateManager.setState(GameFlow.State.InRoom);
      }, 1000);
  };

  // --- Render ---

  if (checkingSave) return null;

  if (step === 'gender') {
      return (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
              {showGenderPrompt ? (
                  <StoryDialog 
                    content="告訴我你是誰——" 
                    onClose={() => setShowGenderPrompt(false)} 
                  />
              ) : (
                  <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
                      <h2 className="text-white text-xl font-bold mb-4">告訴我哪個是你</h2>
                      <div className="flex gap-4 sm:gap-8">
                          {[
                              { id: 'male', img: ASSETS.SPRITES.PLAYER_VARIANTS.MALE.URL },
                              { id: 'female', img: ASSETS.SPRITES.PLAYER_VARIANTS.FEMALE.URL },
                              { id: 'neutral', img: ASSETS.SPRITES.PLAYER_VARIANTS.NEUTRAL.URL }
                          ].map((opt) => (
                              <button
                                  key={opt.id}
                                  onClick={() => handleGenderSelect(opt.id as Gender)}
                                  className={`
                                      group nes-container is-rounded is-dark p-2 flex flex-col items-center cursor-pointer transition-all
                                      ${selectedGender === opt.id ? 'border-yellow-400 bg-gray-800' : 'hover:border-white'}
                                  `}
                                  style={{ width: '100px' }}
                              >
                                  <div 
                                      className="w-[64px] h-[64px] overflow-hidden mb-2 relative image-pixelated"
                                  >
                                      {/* Show first frame (approx) - CSS sprite crop */}
                                      {/* Using frame 130 (walk-down idle) as reference */}
                                      <div 
                                          style={{ 
                                              width: '832px', // 13 cols * 64
                                              height: '1344px', // 21 rows * 64
                                              backgroundImage: `url(${opt.img})`,
                                              backgroundPosition: '0px -640px', // Row 10 (10 * 64 = 640)
                                              transform: 'scale(1)',
                                              transformOrigin: 'top left'
                                          }}
                                      ></div>
                                  </div>
                              </button>
                          ))}
                      </div>

                      {showNamePrompt && selectedGender && (
                          <div className="absolute bottom-0 left-0 right-0">
                               <StoryDialog 
                                    content="告訴我你的名字——" 
                                    onClose={handleGenderConfirm} 
                                />
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  }

  if (step === 'name' && selectedGender) {
    return (
        <NamePicker 
            gender={selectedGender} 
            onConfirm={handleNameComplete}
            title="你是誰"
            showCancel={false}
        />
    );
  }

  // Intro Dialog Phase
  return (
      <div className="absolute inset-0 bg-black z-50">
          {isFashing && (
             <div className="absolute inset-0 bg-white animate-out fade-out duration-1000 z-[100] pointer-events-none" />
          )}
          
          {introContent && (
             <StoryDialog 
                content={introContent} 
                onClose={handleIntroComplete} 
             />
          )}
      </div>
  );
};

export default OnboardingStage;

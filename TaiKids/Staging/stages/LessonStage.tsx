
import React, { useState } from 'react';
import PixelEssayGame from '../Lessons/PixelEssayGame/PixelEssayGame';
import VerticalEssayGame from '../Lessons/VerticalEssayGame/VerticalEssayGame';
import QuizGame from '../Lessons/Quiz/QuizGame';
import MakeASentenceGame from '../Lessons/MakeASentenceGame/MakeASentenceGame';
import stateManager, { GameFlow } from '../game/managers/StateManager';
import { GAME_FLOW_CONFIG, LessonConfig } from '../game/data/gameConfig';
import { LessonResult } from '../Lessons/PixelEssayGame/types';
import LessonPicker from '../Lessons/LessonPicker';

interface Props {
  currentWeek: number;
}

const FREE_MODE_START_WEEK = 13;

const LessonStage: React.FC<Props> = ({ currentWeek }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  
  // Determine if we are in free mode (Week 13+)
  const isFreeMode = currentWeek >= FREE_MODE_START_WEEK;

  // Initialize current lesson logic
  const currentLesson: LessonConfig | undefined = (() => {
      if (!isFreeMode) {
          // Standard Flow: Cycle through available lessons based on week
          const idx = (currentWeek - 1) % GAME_FLOW_CONFIG.lessons.length;
          return GAME_FLOW_CONFIG.lessons[idx];
      } else {
          // Free Mode: Use user selection
          return GAME_FLOW_CONFIG.lessons.find(l => l.id === selectedLessonId);
      }
  })();

  const handleComplete = (result: LessonResult) => {
    if (!currentLesson) return;

    setIsExiting(true);

    // Determine Result Data based on mode
    let storyDialog = currentLesson.storyDialog;
    let rewards = currentLesson.rewards;

    if (isFreeMode) {
        storyDialog = "你開始不確定到底還要多久才能離開這裡。";
        rewards = { money: 10, closeness: 0 };
    }

    // Delay state transition to allow fade-out animation to play
    setTimeout(() => {
        const event = new CustomEvent('cmd-buffer-lesson-result', {
            detail: {
                result: result,
                tValueFactor: currentLesson.tValueFactor,
                story: storyDialog,
                rewards: rewards
            }
        });
        window.dispatchEvent(event);

        // Transition to StoryTelling
        stateManager.setState(GameFlow.State.StoryTelling);
    }, 500);
  };

  const renderGame = () => {
      if (!currentLesson) return null;

      switch (currentLesson.type) {
          case 'essay':
              if (currentLesson.id === 'lesson-3' || currentLesson.id === 'lesson-4') {
                  return <VerticalEssayGame lessonId={currentLesson.id} onComplete={handleComplete} />;
              }
              return <PixelEssayGame lessonId={currentLesson.id} onComplete={handleComplete} />;
          case 'quiz':
              return <QuizGame lessonId={currentLesson.id} onComplete={handleComplete} />;
          case 'make_sentence':
              return <MakeASentenceGame lessonId={currentLesson.id} onComplete={handleComplete} />;
          default:
              return <div>Unknown Lesson Type</div>;
      }
  };

  // --- Lesson Picker UI for Free Mode ---
  if (isFreeMode && !currentLesson) {
      return (
          <LessonPicker 
            currentWeek={currentWeek} 
            lessons={GAME_FLOW_CONFIG.lessons} 
            onSelect={setSelectedLessonId} 
          />
      );
  }

  return (
    <div 
      className={`
        absolute inset-0 z-50 bg-zinc-800 
        transition-opacity duration-500 ease-in-out
        ${isExiting ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-500'}
      `}
    >
      {renderGame()}
    </div>
  );
};

export default LessonStage;

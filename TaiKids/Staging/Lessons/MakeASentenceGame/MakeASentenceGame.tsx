
import React, { useState, useEffect } from 'react';
import { SENTENCE_LESSONS } from './MakeASentenceData';
import { LessonResult } from '../PixelEssayGame/types';
import SharedInstructionDialog from '../components/SharedInstructionDialog';
import ControlBar from '../components/ControlBar';
import { GameState } from '../types';

interface Props {
  lessonId?: string;
  onComplete: (result: LessonResult) => void;
}

interface WordItem {
  id: string;
  text: string;
}

const MakeASentenceGame: React.FC<Props> = ({ lessonId = 'eng-1', onComplete }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.INSTRUCTION);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [failedQuestions, setFailedQuestions] = useState<string[]>([]);
  
  const questions = SENTENCE_LESSONS[lessonId] || SENTENCE_LESSONS['eng-1'];

  // Game State for current question
  const [availableWords, setAvailableWords] = useState<WordItem[]>([]);
  const [placedWords, setPlacedWords] = useState<WordItem[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Drag State
  const [draggedItem, setDraggedItem] = useState<WordItem | null>(null);

  useEffect(() => {
    loadQuestion(0);
  }, [lessonId]);

  const loadQuestion = (index: number) => {
    const q = questions[index];
    const words = q.phrases.map((text, idx) => ({
      id: `w-${index}-${idx}`,
      text
    }));
    setAvailableWords(words);
    setPlacedWords([]);
    setFeedback(null);
  };

  const handleStart = () => {
    setGameState(GameState.PLAYING);
  };

  // --- Drag & Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, item: WordItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropToSentence = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // If word is already in sentence, do nothing (or implement reorder if needed)
    if (placedWords.find(w => w.id === draggedItem.id)) return;

    // Move from pool to sentence
    setPlacedWords(prev => [...prev, draggedItem]);
    setAvailableWords(prev => prev.filter(w => w.id !== draggedItem.id));
    setDraggedItem(null);
  };

  const handleDropToPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // If word is already in pool, do nothing
    if (availableWords.find(w => w.id === draggedItem.id)) return;

    // Move from sentence to pool
    setAvailableWords(prev => [...prev, draggedItem]);
    setPlacedWords(prev => prev.filter(w => w.id !== draggedItem.id));
    setDraggedItem(null);
  };

  const handleWordClick = (item: WordItem, source: 'pool' | 'sentence') => {
    if (gameState !== GameState.PLAYING) return;
    
    if (source === 'pool') {
      setPlacedWords(prev => [...prev, item]);
      setAvailableWords(prev => prev.filter(w => w.id !== item.id));
    } else {
      setAvailableWords(prev => [...prev, item]);
      setPlacedWords(prev => prev.filter(w => w.id !== item.id));
    }
  };

  const handleGrading = () => {
    const currentQ = questions[currentQIndex];
    const userSentence = placedWords.map(w => w.text).join(' ');
    const isCorrect = userSentence.trim() === currentQ.answer.trim();

    let pointsEarned = 0;

    if (isCorrect) {
      setFeedback('correct');
      // Weights: Q1=33, Q2=33, Q3=34 (Sum 100)
      if (currentQIndex === 0) pointsEarned = 33;
      else if (currentQIndex === 1) pointsEarned = 33;
      else if (currentQIndex === 2) pointsEarned = 34;
      
      setTotalScore(prev => prev + pointsEarned);
    } else {
      setFeedback('wrong');
      setFailedQuestions(prev => [...prev, `Q${currentQIndex + 1}`]);
    }

    // Advance regardless of result
    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        loadQuestion(currentQIndex + 1);
      } else {
        finishGame(totalScore + pointsEarned);
      }
    }, 2000);
  };

  const finishGame = (finalScore: number) => {
    setGameState(GameState.RESULT);
    
    let comment = "老師搖搖頭，覺得你的英文需要重修。";
    if (finalScore === 100) comment = "老師很驚訝，你的英文竟然這麼好。";
    else if (finalScore >= 60) comment = "老師說馬馬虎虎，不要放棄治療。";

    const result: LessonResult = {
      id: 999, // Arbitrary ID
      name: "英文造句",
      score: finalScore,
      failed: failedQuestions,
      lessonComment: comment
    };
    
    // Auto complete after short delay
    setTimeout(() => {
        if (onComplete) onComplete(result);
    }, 1000);
  };

  const isInstruction = gameState === GameState.INSTRUCTION;

  return (
    <div className={`
      w-full h-full bg-[#3d3d3d] text-white flex flex-col items-center select-none overflow-hidden touch-none
      pixel-font
    `}>

      {/* Main Game Area */}
      <div className={`
        flex-1 w-full max-w-[600px] px-2 py-4 flex flex-col pt-20
        transition-opacity duration-300
        ${isInstruction ? 'opacity-20 pointer-events-none' : 'opacity-100'}
      `}>
        
        {/* Paper Container (Question + Answer) */}
        <div className="bg-[#fff9e6] p-3 rounded shadow-xl border-4 border-[#5c3e2b] relative flex flex-col gap-4 min-h-[300px]">
             {/* Paper Header */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-[#e6dcc3] border-b border-[#d4c5a3] flex items-center justify-between px-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Question {currentQIndex + 1}/{questions.length}</span>
                <span className="text-[10px] text-gray-500">English</span>
            </div>
            
            <div className="mt-8 text-gray-800 text-sm sm:text-base font-bold whitespace-pre-wrap leading-relaxed px-2">
                {questions[currentQIndex].question}
            </div>

            {/* Answer Zone (Lines) */}
            <div 
                className={`
                    flex-1 rounded border-2 border-dashed
                    flex flex-wrap content-start items-center gap-2 p-2
                    transition-colors duration-200
                    ${feedback === 'correct' ? 'border-green-500 bg-green-50/50' : ''}
                    ${feedback === 'wrong' ? 'border-red-500 bg-red-50/50' : 'border-[#d4c5a3] bg-white/50'}
                `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropToSentence}
            >
                {placedWords.length === 0 && !feedback && (
                    <div className="w-full text-center text-gray-400 text-xs mt-4">
                        拖曳單字至此
                    </div>
                )}
                {placedWords.map((word) => (
                    <button
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        onClick={() => handleWordClick(word, 'sentence')}
                        className="nes-btn is-primary is-small font-sans !m-0 !py-1 !px-2 text-xs sm:text-sm"
                    >
                        {word.text}
                    </button>
                ))}
            </div>

            {/* Feedback Overlay Stamp */}
            {feedback && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black/10 backdrop-blur-[1px]">
                   <div className={`
                       w-32 h-32 rounded-full border-8 flex items-center justify-center transform rotate-[-12deg] animate-in zoom-in duration-300 bg-white/90
                       ${feedback === 'correct' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'}
                   `}>
                       <span className="text-4xl font-bold font-pixel">
                           {feedback === 'correct' ? 'GOOD' : 'BAD'}
                       </span>
                   </div>
                </div>
            )}
        </div>

        {/* Word Pool (Bottom) */}
        <div className="mt-4 bg-[#2a2a2a] p-3 rounded-t-xl border-t-4 border-black h-full relative flex flex-col flex-1"
             onDragOver={(e) => e.preventDefault()}
             onDrop={handleDropToPool}
        >
             <div className="flex items-center justify-between mb-3 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-600 pb-2">
                 <span>Word Bank</span>
             </div>
             
             <div className="flex flex-wrap gap-3 justify-center content-start overflow-y-auto">
                {availableWords.map((word) => (
                    <button
                        key={word.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, word)}
                        onClick={() => handleWordClick(word, 'pool')}
                        className="nes-btn is-normal is-small font-sans !m-0 !py-1 !px-2 text-xs sm:text-sm"
                    >
                        {word.text}
                    </button>
                ))}
             </div>
        </div>

      </div>

      <ControlBar 
        gameState={gameState} 
        onGrading={handleGrading} 
        onExit={() => {}}
        submitLabel="Submit Answer"
      />

      {isInstruction && (
        <SharedInstructionDialog 
          title="英文造句" 
          buttonText="開始考試" 
          onStart={handleStart}
        >
          <p>
             老師在黑板上寫下了幾道題目，請完成它們。
          </p>
          <ul className="list-disc list-inside space-y-2 text-xl bg-white/50 p-4 rounded-lg">
            <li>將下方的<span className="text-blue-700 font-bold">單字卡</span>拖曳到上方空格。</li>
            <li>組成符合題意的<span className="text-red-700 font-bold">正確句子</span>。</li>
            <li>答錯會被扣分，但考試仍會繼續。</li>
          </ul>
        </SharedInstructionDialog>
      )}
    </div>
  );
};

export default MakeASentenceGame;

import React, { useState, useEffect } from 'react';
import { LessonResult } from '../PixelEssayGame/types';
import SharedInstructionDialog from '../components/SharedInstructionDialog';
import { QuizLessonData } from './types';
import { QUIZ_LESSONS, getLessonResultComment } from './constants';
import { CheckCircle, XCircle, ChevronRight, LogOut } from 'lucide-react';

interface Props {
  lessonId: string;
  onComplete: (result: LessonResult) => void;
}

const QuizGame: React.FC<Props> = ({ lessonId, onComplete }) => {
  const [lessonData, setLessonData] = useState<QuizLessonData | null>(null);
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  
  // Interaction State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Determine lesson data, default to geo-1 if not found
    const data = QUIZ_LESSONS[lessonId] || QUIZ_LESSONS["geo-1"];
    setLessonData(data);
  }, [lessonId]);

  if (!lessonData) return null;

  const currentQuestion = lessonData.question_sets[currentQIndex];
  const totalQuestions = lessonData.question_sets.length;

  const handleOptionClick = (index: number) => {
    if (isRevealed) return;
    setSelectedOption(index);
    setIsRevealed(true);

    const isCorrect = index === currentQuestion.answer_index;
    if (isCorrect) {
      // Simple logic: 3 questions = 100 points
      // 1 correct = 33, 2 correct = 66, 3 correct = 100
      setScore(prev => prev + 1);
    } else {
      setFailed(prev => [...prev, `Q${currentQIndex + 1}`]);
    }
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      setShowResult(true);
    }
  };

  const finishGame = () => {
    // Calculate final score mapped to 100
    // 0 -> 0, 1 -> 33, 2 -> 66, 3 -> 100
    let finalScore = 0;
    if (score === totalQuestions) finalScore = 100;
    else if (score > 0) finalScore = Math.floor((score / totalQuestions) * 100);

    const result: LessonResult = {
      id: parseInt(lessonData.lesson_id.split('-')[1] || '0') + 100, // Offset ID to avoid conflict
      name: lessonData.name,
      score: finalScore,
      failed: failed,
      lessonComment: getLessonResultComment(finalScore)
    };
    onComplete(result);
  };

  if (!started) {
    return (
      <SharedInstructionDialog 
        title={lessonData.name}
        buttonText="開始測驗"
        onStart={() => setStarted(true)}
      >
        <p>這是一場關於<span className="text-blue-800 font-bold mx-1">{lessonData.name}</span>的隨堂測驗。</p>
        <ul className="list-disc list-inside space-y-2 text-xl bg-white/50 p-4 rounded-lg">
          <li>共 {totalQuestions} 題選擇題。</li>
          <li>每題只有一個正確答案。</li>
          <li>答錯將會影響你的平時成績。</li>
        </ul>
        <p>準備好就開始吧！</p>
      </SharedInstructionDialog>
    );
  }

  if (showResult) {
    const finalDisplayScore = score === totalQuestions ? 100 : Math.floor((score / totalQuestions) * 100);
    return (
      <div className="w-full h-full bg-[#2d2d2d] flex flex-col items-center justify-center p-4">
        <div className="nes-container is-dark is-rounded with-title max-w-md w-full animate-in zoom-in">
          <p className="title">測驗結果</p>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">最終得分</p>
            <span className={`text-6xl font-bold ${finalDisplayScore >= 60 ? 'text-green-500' : 'text-red-500'}`}>
              {finalDisplayScore}
            </span>
            <p className="mt-8 text-sm text-left p-4 bg-gray-800 rounded">
              {getLessonResultComment(finalDisplayScore)}
            </p>
          </div>
          <button 
             onClick={finishGame}
             className="nes-btn is-primary w-full flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> 下課
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#3d3d3d] text-white flex flex-col items-center py-4 px-2 overflow-y-auto">
      {/* Progress */}
      <div className="w-full max-w-lg mb-4 flex justify-between items-end px-2">
        <span className="text-xs text-gray-400">Question {currentQIndex + 1} / {totalQuestions}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
             <div 
               key={i} 
               className={`w-3 h-3 rounded-full ${i < currentQIndex ? 'bg-green-500' : (i === currentQIndex ? 'bg-yellow-500' : 'bg-gray-600')}`}
             />
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white text-black p-4 rounded shadow-xl max-w-lg w-full border-4 border-gray-400 relative">
        {/* Image */}
        <div className="w-full aspect-video bg-gray-200 mb-4 overflow-hidden border-2 border-black relative">
          <img 
            src={currentQuestion.question_picture_url} 
            alt="Question" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/600x400/333/FFF?text=Image+Not+Found`;
            }}
          />
        </div>

        {/* Question Text */}
        <div className="min-h-[80px] mb-6">
           <p className="text-lg font-bold leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((opt, idx) => {
            let btnClass = "nes-btn w-full text-left relative";
            let icon = null;

            if (isRevealed) {
              if (idx === currentQuestion.answer_index) {
                btnClass = "nes-btn is-success w-full text-left";
                icon = <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2" size={20}/>;
              } else if (idx === selectedOption) {
                btnClass = "nes-btn is-error w-full text-left";
                icon = <XCircle className="absolute right-4 top-1/2 -translate-y-1/2" size={20}/>;
              } else {
                btnClass = "nes-btn is-disabled w-full text-left opacity-50";
              }
            } else {
               btnClass = "nes-btn w-full text-left hover:brightness-110";
            }

            return (
              <button 
                key={idx}
                className={btnClass}
                onClick={() => handleOptionClick(idx)}
                disabled={isRevealed}
              >
                {opt}
                {icon}
              </button>
            );
          })}
        </div>

        {/* Next Button Overlay */}
        {isRevealed && (
          <div className="absolute -bottom-16 right-0 animate-in slide-in-from-bottom-2 fade-in">
             <button onClick={handleNext} className="nes-btn is-primary flex items-center gap-2">
               {currentQIndex < totalQuestions - 1 ? "下一題" : "查看成績"} <ChevronRight size={16} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;

import React from 'react';
import { LessonConfig } from '../game/data/gameConfig';
import { BookOpen, MapPin, Calculator, ScrollText } from 'lucide-react';

interface Props {
  currentWeek: number;
  lessons: LessonConfig[];
  onSelect: (lessonId: string) => void;
}

const LessonPicker: React.FC<Props> = ({ currentWeek, lessons, onSelect }) => {
  const getLessonIcon = (lesson: LessonConfig) => {
    if (lesson.type === 'quiz') {
      if (lesson.id.includes('geo')) return <MapPin size={24} className="text-green-400"/>;
      if (lesson.id.includes('bio')) return <ScrollText size={24} className="text-emerald-400"/>;
      return <Calculator size={24} className="text-red-400"/>;
    }
    if (lesson.type === 'make_sentence') {
      return <span className="text-xl font-bold text-yellow-400">A</span>;
    }
    // Default essay
    return <BookOpen size={24} className="text-blue-400" />;
  };

  return (
    <div className="absolute inset-0 z-50 bg-zinc-900 flex flex-col items-center justify-center p-4 animate-in fade-in pixel-font">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl text-white text-center mb-2">自主學習</h2>
        <p className="text-gray-400 text-center text-xs mb-8">第 {currentWeek} 週 - 請選擇今天要複習的課程</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            {lessons.map((lesson) => (
                <button
                    key={lesson.id}
                    onClick={() => onSelect(lesson.id)}
                    className="nes-container is-dark is-rounded flex items-center gap-4 hover:bg-gray-800 transition-colors text-left"
                >
                    <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-black/30 rounded-full border-2 border-gray-600">
                        {getLessonIcon(lesson)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white mb-1">
                            {lesson.title}
                        </div>
                        <div className="text-[10px] text-gray-400">
                            {lesson.tValueFactor < 0 ? '當地私人學校' : '台商學校'}
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LessonPicker;

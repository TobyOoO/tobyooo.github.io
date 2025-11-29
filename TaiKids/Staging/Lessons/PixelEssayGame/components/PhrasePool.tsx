import React from 'react';
import { Phrase, GameState, DragState } from '../types';
import { GripVertical } from 'lucide-react';

interface Props {
  pool: Phrase[];
  gameState: GameState;
  dragState: DragState;
  onPointerDown: (e: React.PointerEvent, phrase: Phrase) => void;
}

const PhrasePool: React.FC<Props> = ({ pool, gameState, dragState, onPointerDown }) => {
  const titlePhrases = pool.filter(p => p.type === 'title' && !p.isUsed);
  const bodyPhrases = pool.filter(p => p.type === 'body' && !p.isUsed);
  const isInstruction = gameState === GameState.INSTRUCTION;

  return (
    <div className={`flex-1 w-full max-w-[600px] mt-4 px-2 flex flex-col transition-opacity duration-300 ${isInstruction ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <div className="bg-[#2a2a2a] p-3 rounded-t-xl border-t-4 border-black h-full relative flex flex-col">
        <div className="flex items-center justify-between mb-3 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-600 pb-2">
           <span className="flex items-center gap-1"><GripVertical size={14}/> 字詞卡</span>
        </div>

        <div className="flex flex-col gap-4 min-h-[100px] overflow-y-auto"> 
          {/* Title Phrases */}
          {titlePhrases.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center content-start">
              {titlePhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  onPointerDown={(e) => onPointerDown(e, phrase)}
                  className={`
                    px-3 py-1.5 rounded-sm handwriting-font text-xl cursor-grab active:cursor-grabbing
                    transition-all duration-100 touch-none border-b-2
                    ${dragState.isDragging && dragState.phrase?.id === phrase.id ? 'opacity-0' : 'opacity-100 hover:-translate-y-0.5'}
                    bg-blue-100 text-blue-900 border-blue-300
                  `}
                >
                  {phrase.text}
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          {(titlePhrases.length > 0 && bodyPhrases.length > 0) && (
            <div className="w-full h-[1px] bg-gray-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          )}

          {/* Body Phrases */}
          {bodyPhrases.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center content-start">
              {bodyPhrases.map((phrase) => (
                 <div
                  key={phrase.id}
                  onPointerDown={(e) => onPointerDown(e, phrase)}
                  className={`
                    px-3 py-1.5 rounded-sm handwriting-font text-xl cursor-grab active:cursor-grabbing
                    transition-all duration-100 touch-none border-b-2
                    ${dragState.isDragging && dragState.phrase?.id === phrase.id ? 'opacity-0' : 'opacity-100 hover:-translate-y-0.5'}
                    bg-emerald-100 text-emerald-900 border-emerald-300
                  `}
                >
                  {phrase.text}
                </div>
              ))}
            </div>
          )}
           
           {titlePhrases.length === 0 && bodyPhrases.length === 0 && gameState === GameState.PLAYING && (
             <div className="text-center text-gray-500 text-sm italic mt-4">
               All cards placed. Click "交給老師批改" to submit.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PhrasePool;
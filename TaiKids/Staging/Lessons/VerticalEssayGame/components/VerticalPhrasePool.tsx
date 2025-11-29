import React from 'react';
import { Phrase, GameState, DragState } from '../../PixelEssayGame/types';
import { GripVertical } from 'lucide-react';

interface Props {
  pool: Phrase[];
  gameState: GameState;
  dragState: DragState;
  onPointerDown: (e: React.PointerEvent, phrase: Phrase) => void;
}

const VerticalPhrasePool: React.FC<Props> = ({ pool, gameState, dragState, onPointerDown }) => {
  const titlePhrases = pool.filter(p => p.type === 'title' && !p.isUsed);
  const bodyPhrases = pool.filter(p => p.type === 'body' && !p.isUsed);
  const isInstruction = gameState === GameState.INSTRUCTION;

  return (
    <div className={`w-full h-full transition-opacity duration-300 ${isInstruction ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <div className="bg-[#2a2a2a] p-2 border-t-4 border-black h-full relative flex flex-col shadow-inner">
        
        <div className="flex items-center justify-between mb-2 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-600 pb-1 shrink-0">
           <span className="flex items-center gap-1"><GripVertical size={14}/> 字詞庫 (直書)</span>
        </div>

        {/* writing-mode: vertical-rl makes the content flow RTL and scroll horizontally */}
        <div 
          className="flex-1 overflow-x-auto overflow-y-hidden"
          style={{ writingMode: 'vertical-rl' }}
        >
            <div className="flex flex-wrap content-start gap-3 h-full py-2 pr-2">
                {titlePhrases.map((phrase) => (
                    <div
                        key={phrase.id}
                        onPointerDown={(e) => onPointerDown(e, phrase)}
                        className={`
                            px-2 py-3 rounded-sm handwriting-font text-lg cursor-grab active:cursor-grabbing
                            transition-all duration-100 touch-none border-l-2 my-1
                            ${dragState.isDragging && dragState.phrase?.id === phrase.id ? 'opacity-0' : 'opacity-100 hover:-translate-x-1'}
                            bg-blue-100 text-blue-900 border-blue-300
                            flex items-center justify-center tracking-widest
                        `}
                        style={{ textOrientation: 'upright' }}
                    >
                        {phrase.text}
                    </div>
                ))}

                {(titlePhrases.length > 0 && bodyPhrases.length > 0) && (
                     <div className="w-[1px] h-full bg-gray-600 mx-2"></div>
                )}

                {bodyPhrases.map((phrase) => (
                    <div
                        key={phrase.id}
                        onPointerDown={(e) => onPointerDown(e, phrase)}
                        className={`
                            px-2 py-3 rounded-sm handwriting-font text-lg cursor-grab active:cursor-grabbing
                            transition-all duration-100 touch-none border-l-2 my-1
                            ${dragState.isDragging && dragState.phrase?.id === phrase.id ? 'opacity-0' : 'opacity-100 hover:-translate-x-1'}
                            bg-emerald-100 text-emerald-900 border-emerald-300
                            flex items-center justify-center tracking-widest
                        `}
                        style={{ textOrientation: 'upright' }}
                    >
                        {phrase.text}
                    </div>
                ))}
            </div>
        </div>

        {titlePhrases.length === 0 && bodyPhrases.length === 0 && gameState === GameState.PLAYING && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-gray-500 text-sm italic bg-black/50 px-2 rounded">
                   已完成，請批改
               </span>
             </div>
        )}
      </div>
    </div>
  );
};

export default VerticalPhrasePool;
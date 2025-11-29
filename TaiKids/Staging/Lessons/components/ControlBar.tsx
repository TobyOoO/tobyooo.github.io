
import React from 'react';
import { GameState } from '../types';
import { ScrollText, LogOut } from 'lucide-react';

interface Props {
  gameState: GameState;
  onGrading: () => void;
  onExit: () => void;
  submitLabel?: string;
  exitLabel?: string;
}

const ControlBar: React.FC<Props> = ({ 
  gameState, 
  onGrading, 
  onExit,
  submitLabel = "交給老師批改",
  exitLabel = "放學回房間"
}) => {
  const isInstruction = gameState === GameState.INSTRUCTION;

  return (
    <div className={`w-full bg-[#222] p-4 flex justify-center border-t border-gray-700 transition-opacity duration-300 ${isInstruction ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
       {gameState === GameState.RESULT ? (
         <button
           onClick={onExit}
           className="flex items-center gap-2 px-8 py-3 rounded font-bold text-lg shadow-lg bg-green-600 text-white hover:bg-green-700 border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
         >
           <LogOut size={20} />
           {exitLabel}
         </button>
       ) : (
         <button
           onClick={onGrading}
           disabled={gameState !== GameState.PLAYING}
           className={`
             flex items-center gap-2 px-8 py-3 rounded font-bold text-lg shadow-lg w-full max-w-md justify-center
             transform transition-all duration-100
             ${gameState === GameState.PLAYING 
               ? 'bg-[#d93025] text-white hover:bg-[#b02015] border-b-4 border-[#8a1a10] active:border-b-0 active:translate-y-1' 
               : 'bg-gray-600 text-gray-400 cursor-not-allowed border-b-4 border-gray-800'}
           `}
         >
           <ScrollText size={20} />
           {submitLabel}
         </button>
       )}
    </div>
  );
};

export default ControlBar;

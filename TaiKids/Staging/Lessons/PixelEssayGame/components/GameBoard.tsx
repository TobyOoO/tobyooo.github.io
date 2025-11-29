import React from 'react';
import { GridCell, ValidationResult, GameState, DragState } from '../types';
import { GRID_COLS } from '../constants';
import GridCellComponent from './GridCell';

interface Props {
  grid: GridCell[];
  gameState: GameState;
  result: ValidationResult | null;
  dragState: DragState;
  ghostIndices: number[];
  isGhostValid: boolean;
  onCellClick: (index: number) => void;
}

const GameBoard: React.FC<Props> = ({ 
  grid, 
  gameState, 
  result, 
  dragState,
  ghostIndices,
  isGhostValid,
  onCellClick 
}) => {
  
  const isInstruction = gameState === GameState.INSTRUCTION;

  const renderGridCell = (cell: GridCell) => {
    // Determine ghost logic
    let ghostChar = undefined;
    const ghostPos = ghostIndices.indexOf(cell.index);
    if (ghostPos !== -1 && dragState.phrase) {
      ghostChar = dragState.phrase.text[ghostPos];
    }

    // Determine Mistake Logic
    const isMistake = result ? result.mistakeIndices.includes(cell.index) : false;

    return (
      <GridCellComponent 
        key={cell.index}
        cell={cell}
        ghostChar={ghostChar}
        isValidGhost={isGhostValid}
        isMistake={isMistake}
        onClick={() => onCellClick(cell.index)}
      />
    );
  };

  return (
    <div className={`w-full max-w-[600px] px-1 sm:px-2 relative transition-opacity duration-300 ${isInstruction ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <div className="bg-[#fff9e6] p-2 sm:p-3 rounded shadow-xl border-4 border-[#5c3e2b] relative overflow-hidden">
        {/* Paper Header Decoration */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-[#e6dcc3] border-b border-[#d4c5a3] flex items-center justify-between px-4">
           <span className="text-[10px] text-gray-500 uppercase tracking-widest">作文用紙</span>
           <span className="text-[10px] text-gray-500">語文測驗</span>
        </div>

        <div className="mt-6 flex flex-col">
          {/* Title Row Grid (Index 0-13) */}
          <div 
            className="grid gap-0 border-l border-t border-gray-300/50"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          >
            {grid.slice(0, 14).map(renderGridCell)}
          </div>

          {/* Horizontal Padding / Gap */}
          <div className="h-1 w-full bg-blue-900/50"></div>

          {/* Body Rows Grid (Index 14+) */}
          <div 
            className="grid gap-0 border-l border-t border-gray-300/50"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          >
            {grid.slice(14).map(renderGridCell)}
          </div>
        </div>

        {/* Result Overlay Stamp */}
        {gameState === GameState.RESULT && result && (
          <div className="absolute top-10 right-4 z-40 pointer-events-none animate-in zoom-in duration-300">
            <div className={`
              w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 
              ${result.score === 100 ? 'border-red-600 text-red-600' : 'border-red-600 text-red-600'}
              flex items-center justify-center transform rotate-12 bg-white/10 backdrop-blur-sm
            `}>
               <div className="flex flex-col items-center">
                  <span className="handwriting-font text-5xl sm:text-6xl font-bold">{result.score}</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
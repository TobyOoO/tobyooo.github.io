
import React from 'react';
import { GridCell, ValidationResult, GameState, DragState } from '../../PixelEssayGame/types';
import VerticalGridCell from './VerticalGridCell';
import { GRID_ROWS, GRID_COLS } from '../constants';

interface Props {
  grid: GridCell[];
  gameState: GameState;
  result: ValidationResult | null;
  dragState: DragState;
  ghostIndices: number[];
  isGhostValid: boolean;
  onCellClick: (index: number) => void;
}

const VerticalGameBoard: React.FC<Props> = ({ 
  grid, 
  gameState, 
  result, 
  dragState,
  ghostIndices,
  isGhostValid,
  onCellClick 
}) => {
  
  const isInstruction = gameState === GameState.INSTRUCTION;

  if (!grid || grid.length === 0) return null;

  // Visual Grid rendering logic
  const renderVisualGrid = () => {
    const visualCells = [];
    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            // Visual Column 0 is on the Left.
            // Logical Column 0 is the Title Column (Rightmost Visual Column).
            // We need to map Visual(r,c) to Logical Index.
            // Visual Col C corresponds to Logical Col (GRID_COLS - 1 - c).
            const logicalCol = (GRID_COLS - 1) - c;
            const logicalIndex = logicalCol * GRID_ROWS + r;
            const cell = grid[logicalIndex];
            
            if (!cell) continue; 

            let ghostChar = undefined;
            const ghostPos = ghostIndices.indexOf(logicalIndex);
            if (ghostPos !== -1 && dragState.phrase) {
                ghostChar = dragState.phrase.text[ghostPos];
            }

            const isMistake = result ? result.mistakeIndices.includes(logicalIndex) : false;

            visualCells.push(
                <VerticalGridCell 
                    key={`v-${r}-${c}`}
                    cell={cell}
                    ghostChar={ghostChar}
                    isValidGhost={isGhostValid}
                    isMistake={isMistake}
                    onClick={() => onCellClick(logicalIndex)}
                />
            );
        }
    }
    return visualCells;
  };

  return (
    <div className={`h-full w-full px-2 relative transition-opacity duration-300 flex justify-center items-center ${isInstruction ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
      <div 
        className="bg-[#fff9e6] p-2 rounded shadow-xl border-4 border-[#5c3e2b] relative flex flex-col box-border"
        style={{ 
            aspectRatio: `${GRID_COLS}/${GRID_ROWS}`,
            height: '100%',
            width: 'auto',
            maxWidth: '100%'
        }}
      >
        {/* Paper Header */}
        <div className="h-8 bg-[#e6dcc3] border-b border-[#d4c5a3] flex items-center justify-between px-2 shrink-0">
           <span className="text-[10px] text-gray-500 uppercase tracking-widest">作文用紙 (直書)</span>
        </div>

        <div className="flex-1 border-l border-t border-gray-300/50 bg-white relative">
             <div 
                className="grid w-full h-full"
                style={{ 
                    gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`
                }}
             >
                 {renderVisualGrid()}
             </div>
        </div>

        {/* Score Stamp */}
        {gameState === GameState.RESULT && result && (
          <div className="absolute top-[15%] right-[10%] z-40 pointer-events-none animate-in zoom-in duration-300">
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

export default VerticalGameBoard;

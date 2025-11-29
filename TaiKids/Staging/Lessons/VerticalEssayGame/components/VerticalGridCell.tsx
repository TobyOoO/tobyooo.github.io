
import React from 'react';
import { GridCell as IGridCell } from '../../PixelEssayGame/types';
import { TITLE_END_INDEX } from '../constants';

interface Props {
  cell: IGridCell;
  ghostChar?: string;
  isValidGhost?: boolean;
  isMistake?: boolean; 
  onClick: () => void;
}

const VerticalGridCell: React.FC<Props> = ({ cell, ghostChar, isValidGhost, isMistake, onClick }) => {
  const showGhost = !!ghostChar;
  const content = cell.content;
  
  // Logical index <= 9 is the first logical column (Title).
  const isTitleCol = cell.index <= TITLE_END_INDEX;

  const baseBorder = isTitleCol 
    ? 'border-blue-900/20' 
    : 'border-emerald-900/20';
  
  const bgStyle = isTitleCol
    ? 'bg-blue-50/50'
    : 'bg-emerald-50/50';

  return (
    <div 
      data-cell-index={cell.index}
      onClick={onClick}
      className={`
        relative border-b border-r ${baseBorder} ${bgStyle}
        flex items-center justify-center 
        w-full h-full select-none
        transition-colors duration-150
      `}
    >
      {/* Dashed Cross (Tian Zi Ge) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className={`w-full h-[1px] ${isTitleCol ? 'bg-blue-900/10' : 'bg-emerald-900/10'} border-t border-dashed ${isTitleCol ? 'border-blue-900/20' : 'border-emerald-900/20'}`}></div>
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className={`h-full w-[1px] ${isTitleCol ? 'bg-blue-900/10' : 'bg-emerald-900/10'} border-l border-dashed ${isTitleCol ? 'border-blue-900/20' : 'border-emerald-900/20'}`}></div>
      </div>

      {/* Placed Content */}
      {content && (
        <div className={`
          z-10 w-[90%] h-[90%] flex items-center justify-center rounded-sm
          handwriting-font text-xl sm:text-2xl text-gray-900
          bg-white/60 shadow-sm
          animate-in zoom-in duration-200 cursor-pointer
          ${content.type === 'title' ? 'text-blue-900' : 'text-emerald-900'}
        `}
        title="Tap to remove"
        >
          {content.char}
        </div>
      )}

      {/* Ghost Content */}
      {showGhost && !content && (
        <div className={`
          z-20 w-full h-full flex items-center justify-center
          handwriting-font text-xl sm:text-2xl opacity-50
          ${isValidGhost 
            ? (isTitleCol ? 'text-blue-600 bg-blue-200/50' : 'text-emerald-600 bg-emerald-200/50') 
            : 'text-red-600 bg-red-200/50'}
        `}>
          {ghostChar}
        </div>
      )}

      {/* Mistake Overlay */}
      {isMistake && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md opacity-90 transform rotate-[-10deg] scale-125">
             <path 
               d="M 20,50 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0" 
               fill="none" 
               stroke="#d93025" 
               strokeWidth="8" 
               strokeLinecap="round"
               className="animate-in zoom-in duration-500"
               style={{ strokeDasharray: "200", strokeDashoffset: "0" }}
             />
          </svg>
        </div>
      )}
    </div>
  );
};

export default VerticalGridCell;

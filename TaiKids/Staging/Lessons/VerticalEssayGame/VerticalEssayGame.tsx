
import React, { useState, useEffect, useRef } from 'react';
import { GameState, Phrase, GridCell, ValidationResult, LevelData, DragState, LessonResult } from '../PixelEssayGame/types';
import { GRID_SIZE, VERTICAL_ESSAY_LEVELS, TITLE_END_INDEX, BODY_START_INDEX, generateVerticalLessonResult, GRID_ROWS, GRID_COLS } from './constants';
import InstructionDialog from './components/InstructionDialog';
import VerticalGameBoard from './components/VerticalGameBoard';
import VerticalPhrasePool from './components/VerticalPhrasePool';
import ControlBar from '../PixelEssayGame/components/ControlBar';
import { calculateVerticalBodyText } from './utils';

interface Props {
  lessonId?: string;
  onComplete?: (result: LessonResult) => void;
}

const VerticalEssayGame: React.FC<Props> = ({ lessonId = 'lesson-3', onComplete }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [levelData, setLevelData] = useState<LevelData>(VERTICAL_ESSAY_LEVELS['lesson-3']);
  
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [pool, setPool] = useState<Phrase[]>([]);
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    phrase: null,
    startPointer: { x: 0, y: 0 },
    currentPointer: { x: 0, y: 0 },
    hoverIndex: null
  });

  const [result, setResult] = useState<ValidationResult | null>(null);
  const [lessonResultData, setLessonResultData] = useState<LessonResult | null>(null);

  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const level = VERTICAL_ESSAY_LEVELS[lessonId] || VERTICAL_ESSAY_LEVELS['lesson-3'];
    setLevelData(level);
    
    // Initialize logical grid
    const newGrid = Array.from({ length: GRID_SIZE }, (_, i) => ({
      index: i,
      content: null
    }));
    setGrid(newGrid);

    const newPool = level.phrases.map((p, idx) => ({
      id: `phrase-${idx}`,
      text: p.text,
      type: p.type,
      isUsed: false
    }));
    setPool(newPool);
    setGameState(GameState.INSTRUCTION);

    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    };
  }, [lessonId]);

  const startGame = () => {
    setGameState(GameState.PLAYING);
  };

  // --- Drag & Drop Logic ---

  const calculateTargetIndices = (startIndex: number, textLength: number): number[] | null => {
    const indices: number[] = [];
    // Vertical Flow logic: logical indices increase downwards in a column.
    // When indices exceed the column height (GRID_ROWS), they naturally flow to the next column (startIndex + i)
    // because logical indices are ordered Column by Column (Right to Left).
    // e.g., Index 9 (Col 0 Bottom) -> Index 10 (Col 1 Top).
    for (let i = 0; i < textLength; i++) {
      const target = startIndex + i;
      
      // Allow wrapping to next column, only check if out of total grid size
      if (target >= GRID_SIZE) return null; 
      indices.push(target);
    }
    return indices;
  };

  const checkPlacementValidity = (indices: number[], phrase: Phrase): boolean => {
    if (indices.some(idx => grid[idx].content !== null)) return false;

    // Logical indices 0-9 are Title Column (Col 0)
    if (phrase.type === 'title') {
      return indices.every(idx => idx <= TITLE_END_INDEX);
    } else {
      return indices.every(idx => idx >= BODY_START_INDEX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent, phrase: Phrase) => {
    if (phrase.isUsed || gameState !== GameState.PLAYING) return;

    (e.target as Element).setPointerCapture(e.pointerId);
    setDragState({
      isDragging: true,
      phrase,
      startPointer: { x: e.clientX, y: e.clientY },
      currentPointer: { x: e.clientX, y: e.clientY },
      hoverIndex: null
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.isDragging) return;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    let foundIndex: number | null = null;
    for (const el of elements) {
      const idxAttr = el.getAttribute('data-cell-index');
      if (idxAttr) {
        foundIndex = parseInt(idxAttr, 10);
        break;
      }
    }

    setDragState(prev => ({
      ...prev,
      currentPointer: { x: e.clientX, y: e.clientY },
      hoverIndex: foundIndex
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragState.isDragging || !dragState.phrase) return;
    (e.target as Element).releasePointerCapture(e.pointerId);

    const { phrase, hoverIndex } = dragState;

    if (hoverIndex !== null) {
      const targetIndices = calculateTargetIndices(hoverIndex, phrase.text.length);
      
      if (targetIndices && checkPlacementValidity(targetIndices, phrase)) {
        const newGrid = [...grid];
        targetIndices.forEach((gridIdx, charIdx) => {
          newGrid[gridIdx] = {
            ...newGrid[gridIdx],
            content: {
              phraseId: phrase.id,
              char: phrase.text[charIdx],
              type: phrase.type
            }
          };
        });
        setGrid(newGrid);
        setPool(pool.map(p => p.id === phrase.id ? { ...p, isUsed: true } : p));
      }
    }

    setDragState({ isDragging: false, phrase: null, startPointer: { x: 0, y: 0 }, currentPointer: { x: 0, y: 0 }, hoverIndex: null });
  };

  const handleCellClick = (index: number) => {
    if (gameState !== GameState.PLAYING) return;
    const cell = grid[index];
    if (!cell.content) return;
    const pid = cell.content.phraseId;
    
    setGrid(grid.map(c => c.content?.phraseId === pid ? { ...c, content: null } : c));
    setPool(pool.map(p => p.id === pid ? { ...p, isUsed: false } : p));
  };

  const handleGrading = () => {
    const mistakes: number[] = [];
    const failedRules: string[] = [];

    // Rule 1: Title Indent 4 spaces (Indices 0,1,2,3 empty)
    // Content must start at Index 4.
    let rule1Failed = false;
    for (let i = 0; i < 4; i++) {
        if (grid[i].content !== null) {
            mistakes.push(i);
            rule1Failed = true;
        }
    }
    // Check if title starts at 4.
    if (grid[4].content === null) {
        mistakes.push(4);
        rule1Failed = true;
    }
    
    if (rule1Failed) {
        failedRules.push("Rule1");
    }

    // Rule 2: Body Indent 2 spaces relative to BODY_START_INDEX (10)
    // So 10, 11 empty, 12 filled.
    let rule2Failed = false;
    if (grid[10].content !== null) { mistakes.push(10); rule2Failed = true; }
    if (grid[11].content !== null) { mistakes.push(11); rule2Failed = true; }
    if (grid[12].content === null) { mistakes.push(12); rule2Failed = true; }
    if (rule2Failed) {
        failedRules.push("Rule2");
    }

    // Rule 3: Content Match
    // Collect title text (Top-to-Bottom, which is logical 0-9)
    const titleText = grid.slice(0, BODY_START_INDEX).map(c => c.content?.char || "").join("");
    
    // Collect body text using utility (Right-to-Left columns)
    const bodyText = calculateVerticalBodyText(grid);

    console.log("VerticalEssayGame:handleGrading", {
      "titleText": titleText,
      "bodyText": bodyText
    })

    let rule3Failed = false;
    if (titleText !== levelData.answers.title) {
        rule3Failed = true;
        if (mistakes.length === 0) mistakes.push(0);
    }
    if (bodyText !== levelData.answers.body) {
        rule3Failed = true;
        if (!mistakes.includes(12)) mistakes.push(12);
    }
    if (rule3Failed) {
        failedRules.push("Rule3");
    }

    // Scoring: 33 each, 100 if all
    let score = 0;
    if (!rule1Failed) score += 33;
    if (!rule2Failed) score += 33;
    if (!rule3Failed) score += 33;
    
    if (!rule1Failed && !rule2Failed && !rule3Failed) {
        score = 100;
    }

    const lessonResult = generateVerticalLessonResult(levelData.id, score, failedRules);
    
    setLessonResultData(lessonResult);
    setResult({ score: score, mistakeIndices: mistakes });
    setGameState(GameState.RESULT);

    if (onComplete) {
      completionTimerRef.current = setTimeout(() => {
        onComplete(lessonResult);
      }, 5000);
    }
  };

  const handleExit = () => {
    if (onComplete && lessonResultData) {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
      onComplete(lessonResultData);
    }
  };

  // Ghost Preview
  let ghostIndices: number[] = [];
  let isGhostValid = false;
  if (dragState.isDragging && dragState.phrase && dragState.hoverIndex !== null) {
    const indices = calculateTargetIndices(dragState.hoverIndex, dragState.phrase.text.length);
    if (indices) {
      ghostIndices = indices;
      isGhostValid = checkPlacementValidity(indices, dragState.phrase);
    }
  }

  return (
    <div 
      className={`
        pixel-font
        w-full h-full bg-[#3d3d3d] text-white flex flex-col items-center select-none overflow-hidden touch-none
        py-2 transition-[padding] duration-300 ease-in-out
      `}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >

      {/* Main Content Area - Split Vertical */}
      <div className="flex-1 w-full max-w-[800px] flex flex-col min-h-0">
          
          {/* Upper: Essay Sheet (60%) */}
          <div className="flex-[3] w-full min-h-0 py-2">
            <VerticalGameBoard 
                grid={grid}
                gameState={gameState}
                result={result}
                dragState={dragState}
                ghostIndices={ghostIndices}
                isGhostValid={isGhostValid}
                onCellClick={handleCellClick}
            />
          </div>

          {/* Lower: Phrase Pool (40%) */}
          <div className="flex-[2] w-full min-h-0">
            <VerticalPhrasePool 
                pool={pool}
                gameState={gameState}
                dragState={dragState}
                onPointerDown={handlePointerDown}
            />
          </div>

      </div>

      <ControlBar 
        gameState={gameState}
        onGrading={handleGrading}
        onExit={handleExit}
      />

      {gameState === GameState.INSTRUCTION && (
        <InstructionDialog onStart={startGame} />
      )}

      {/* Drag Avatar - Vertical Writing Mode */}
      {dragState.isDragging && dragState.phrase && (
        <div 
          className={`
            fixed pointer-events-none z-[100] px-2 py-3 rounded shadow-2xl border-2 
            handwriting-font text-2xl whitespace-nowrap
            ${dragState.phrase.type === 'title' 
              ? 'bg-blue-100 text-blue-900 border-blue-500' 
              : 'bg-emerald-100 text-emerald-900 border-emerald-500'}
            flex items-center justify-center tracking-widest
          `}
          style={{
            left: dragState.currentPointer.x,
            top: dragState.currentPointer.y,
            transform: 'translate(32px, -50%)',
            writingMode: 'vertical-rl',
            textOrientation: 'upright'
          }}
        >
          {dragState.phrase.text}
        </div>
      )}
    </div>
  );
};

export default VerticalEssayGame;

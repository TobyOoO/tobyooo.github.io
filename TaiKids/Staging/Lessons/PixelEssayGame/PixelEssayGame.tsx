import React, { useState, useEffect, useRef } from 'react';
import { GameState, Phrase, GridCell, ValidationResult, LevelData, DragState, LessonResult } from './types';
import { GRID_SIZE, ESSAY_LEVELS, TITLE_ROW_END_INDEX, BODY_START_INDEX, generateLessonResult } from './constants';
import InstructionDialog from './components/InstructionDialog';
import GameBoard from './components/GameBoard';
import PhrasePool from './components/PhrasePool';
import ControlBar from '../components/ControlBar';

interface Props {
  lessonId?: string;
  onComplete?: (result: LessonResult) => void;
}

const PixelEssayGame: React.FC<Props> = ({ lessonId = 'lesson-1', onComplete }) => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [levelData, setLevelData] = useState<LevelData>(ESSAY_LEVELS['lesson-1']);
  
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

  // --- Initialization ---
  useEffect(() => {
    // Load Level based on ID, fallback to lesson-1
    const level = ESSAY_LEVELS[lessonId] || ESSAY_LEVELS['lesson-1'];
    setLevelData(level);
    
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
    // DO NOT SHUFFLE: Keep original order
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
    for (let i = 0; i < textLength; i++) {
      const target = startIndex + i;
      if (target >= GRID_SIZE) return null; 
      indices.push(target);
    }
    return indices;
  };

  const checkPlacementValidity = (indices: number[], phrase: Phrase): boolean => {
    // 1. Check for collision
    if (indices.some(idx => grid[idx].content !== null)) return false;

    // 2. Check Zone Rules
    if (phrase.type === 'title') {
      // Must be in Row 0 (Index 0 to 13)
      return indices.every(idx => idx <= TITLE_ROW_END_INDEX);
    } else {
      // Must be in Body (Index 14+)
      return indices.every(idx => idx >= BODY_START_INDEX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent, phrase: Phrase) => {
    if (phrase.isUsed || (gameState !== GameState.PLAYING && gameState !== GameState.INSTRUCTION)) return;
    if (gameState !== GameState.PLAYING) return;

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
        // Place it
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

  // --- Grading Logic ---
  const handleGrading = () => {
    const mistakes: number[] = [];
    const failedRules: string[] = [];

    // Rule 1: Title Centered (Indices 0-4 empty, 5 filled)
    let rule1Failed = false;
    for (let i = 0; i < 5; i++) {
      if (grid[i].content !== null) {
        mistakes.push(i);
        rule1Failed = true;
      }
    }
    if (grid[5].content === null) {
      mistakes.push(5); 
      rule1Failed = true;
    }
    if (rule1Failed) {
      failedRules.push("Rule1");
    }

    // Rule 2: Body Indentation (14, 15 empty, 16 filled)
    let rule2Failed = false;
    if (grid[14].content !== null) { mistakes.push(14); rule2Failed = true; }
    if (grid[15].content !== null) { mistakes.push(15); rule2Failed = true; }
    if (grid[16].content === null) { mistakes.push(16); rule2Failed = true; }
    if (rule2Failed) {
      failedRules.push("Rule2");
    }

    // Rule 3: Content Matching
    const titleText = grid.slice(0, 14)
      .map(c => c.content?.char || "")
      .join("");
    
    const bodyText = grid.slice(14)
      .map(c => c.content?.char || "")
      .join("");

    let rule3Failed = false;
    if (titleText !== levelData.answers.title) {
      rule3Failed = true;
      if (mistakes.length === 0) mistakes.push(0, 13);
    }

    if (bodyText !== levelData.answers.body) {
      rule3Failed = true;
      if (!mistakes.includes(14) && !mistakes.includes(16)) mistakes.push(20); 
    }

    if (rule3Failed) {
      failedRules.push("Rule3");
    }

    let calculatedScore = 0;
    if (!rule1Failed) calculatedScore += 33;
    if (!rule2Failed) calculatedScore += 33;
    if (!rule3Failed) calculatedScore += 33;

    if (!rule1Failed && !rule2Failed && !rule3Failed) {
      calculatedScore = 100;
    }

    const finalScore = calculatedScore;
    
    // Generate full result with comments
    const lessonResult: LessonResult = generateLessonResult(levelData.id, finalScore, failedRules);
    
    setLessonResultData(lessonResult);
    setResult({
      score: finalScore,
      mistakeIndices: mistakes
    });
    setGameState(GameState.RESULT);

    // Auto-complete after 5 seconds
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

  // Calculate Ghost Preview for GameBoard
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
        py-2 sm:py-4 transition-[padding] duration-300 ease-in-out
      `}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <GameBoard 
        grid={grid}
        gameState={gameState}
        result={result}
        dragState={dragState}
        ghostIndices={ghostIndices}
        isGhostValid={isGhostValid}
        onCellClick={handleCellClick}
      />

      <PhrasePool 
        pool={pool}
        gameState={gameState}
        dragState={dragState}
        onPointerDown={handlePointerDown}
      />

      <ControlBar 
        gameState={gameState}
        onGrading={handleGrading}
        onExit={handleExit}
      />

      {gameState === GameState.INSTRUCTION && (
        <InstructionDialog 
          onStart={startGame}
        />
      )}

      {/* Drag Avatar Overlay */}
      {dragState.isDragging && dragState.phrase && (
        <div 
          className={`
            fixed pointer-events-none z-[100] px-3 py-1.5 rounded shadow-2xl border-2 
            handwriting-font text-2xl whitespace-nowrap
            ${dragState.phrase.type === 'title' 
              ? 'bg-blue-100 text-blue-900 border-blue-500' 
              : 'bg-emerald-100 text-emerald-900 border-emerald-500'}
          `}
          style={{
            left: dragState.currentPointer.x,
            top: dragState.currentPointer.y,
            transform: 'translate(-50%, -150%)'
          }}
        >
          {dragState.phrase.text}
        </div>
      )}
    </div>
  );
};

export default PixelEssayGame;
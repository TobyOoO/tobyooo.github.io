
import { GameState } from '../types';

export { GameState };

export type PhraseType = 'title' | 'body';

export interface Phrase {
  id: string;
  text: string;
  type: PhraseType;
  isUsed: boolean;
}

export interface LevelData {
  id: number;
  title: string;
  phrases: { text: string; type: PhraseType }[];
  answers: {
    title: string;
    body: string;
  };
}

export interface GridCellContent {
  phraseId: string;
  char: string;
  type: PhraseType;
}

export interface GridCell {
  index: number;
  content: GridCellContent | null;
}

export interface ValidationResult {
  score: number;
  mistakeIndices: number[]; // Indices of cells to circle in red
  feedback?: string;
  correctedText?: string;
}

export interface DragState {
  isDragging: boolean;
  phrase: Phrase | null;
  startPointer: { x: number; y: number };
  currentPointer: { x: number; y: number };
  hoverIndex: number | null;
}

export interface LessonResult {
  id: number;
  name: string;
  score: number;
  failed: string[];
  lessonComment: string;
  week?: number;
}

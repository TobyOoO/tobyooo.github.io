export interface QuizQuestion {
  question: string;
  question_picture_url: string;
  options: string[];
  answer_index: number;
}

export interface QuizLessonData {
  lesson_id: string;
  name: string;
  question_sets: QuizQuestion[];
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: number[]; // Store user selected indices
  isComplete: boolean;
}
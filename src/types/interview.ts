export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFileName?: string;
  resumeData?: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'paused';
  currentQuestionIndex: number;
  score: number;
  finalSummary?: string;
  answers: Answer[];
  timeRemaining?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  difficulty: QuestionDifficulty;
  timeAllowed: number;
  timeUsed: number;
  score: number;
  aiGrading?: string;
  answeredAt: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  difficulty: QuestionDifficulty;
  timeLimit: number; // in seconds
  role: string;
  category: string;
}

export interface InterviewConfig {
  role: 'fullstack';
  totalQuestions: 6;
  questionDistribution: {
    easy: 2;
    medium: 2;
    hard: 2;
  };
  timePerDifficulty: {
    easy: 20;
    medium: 60;
    hard: 120;
  };
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  questionId?: string;
  isQuestion?: boolean;
}

export interface InterviewState {
  candidates: Candidate[];
  currentCandidateId: string | null;
  isInterviewActive: boolean;
  currentQuestion: Question | null;
  timeRemaining: number;
  chatMessages: ChatMessage[];
  showWelcomeBack: boolean;
}
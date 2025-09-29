import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewState, Candidate, Question, ChatMessage, Answer } from '@/types/interview';

const initialState: InterviewState = {
  candidates: [],
  currentCandidateId: null,
  isInterviewActive: false,
  currentQuestion: null,
  timeRemaining: 0,
  chatMessages: [],
  showWelcomeBack: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    
    updateCandidate: (state, action: PayloadAction<Partial<Candidate> & { id: string }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    },
    
    setCurrentCandidate: (state, action: PayloadAction<string>) => {
      state.currentCandidateId = action.payload;
      const candidate = state.candidates.find(c => c.id === action.payload);
      if (candidate && candidate.status === 'paused') {
        state.showWelcomeBack = true;
      }
    },
    
    startInterview: (state, action: PayloadAction<{ candidateId: string; question: Question }>) => {
      state.isInterviewActive = true;
      state.currentQuestion = action.payload.question;
      state.timeRemaining = action.payload.question.timeLimit;
      
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.status = 'in-progress';
        candidate.startedAt = new Date().toISOString();
      }
    },
    
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
      state.timeRemaining = action.payload.timeLimit;
    },
    
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    
    submitAnswer: (state, action: PayloadAction<{ candidateId: string; answer: Answer }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.answers.push(action.payload.answer);
        candidate.currentQuestionIndex += 1;
      }
    },
    
    completeInterview: (state, action: PayloadAction<{ candidateId: string; finalScore: number; summary: string }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.status = 'completed';
        candidate.score = action.payload.finalScore;
        candidate.finalSummary = action.payload.summary;
        candidate.completedAt = new Date().toISOString();
      }
      
      state.isInterviewActive = false;
      state.currentQuestion = null;
      state.timeRemaining = 0;
    },
    
    pauseInterview: (state, action: PayloadAction<string>) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      if (candidate) {
        candidate.status = 'paused';
        candidate.timeRemaining = state.timeRemaining;
      }
      state.isInterviewActive = false;
    },
    
    resumeInterview: (state, action: PayloadAction<string>) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      if (candidate) {
        candidate.status = 'in-progress';
        state.timeRemaining = candidate.timeRemaining || 0;
      }
      state.isInterviewActive = true;
      state.showWelcomeBack = false;
    },
    
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    
    dismissWelcomeBack: (state) => {
      state.showWelcomeBack = false;
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  setCurrentCandidate,
  startInterview,
  setCurrentQuestion,
  updateTimeRemaining,
  submitAnswer,
  completeInterview,
  pauseInterview,
  resumeInterview,
  addChatMessage,
  clearChatMessages,
  dismissWelcomeBack,
} = interviewSlice.actions;

export default interviewSlice.reducer;
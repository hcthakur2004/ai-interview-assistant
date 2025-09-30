import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActive: false,
  currentQuestion: 0,
  questions: [],
  answers: [],
  timeRemaining: 0,
  candidateInfo: {
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
  },
  score: 0,
  summary: '',
  isComplete: false,
};

export const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCandidateInfo: (state, action) => {
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
    },
    setResumeUrl: (state, action) => {
      state.candidateInfo.resumeUrl = action.payload;
    },
    startInterview: (state, action) => {
      state.isActive = true;
      state.questions = action.payload;
      state.currentQuestion = 0;
      state.answers = new Array(action.payload.length).fill('');
      state.timeRemaining = action.payload[0].timeLimit;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    submitAnswer: (state, action) => {
      state.answers[state.currentQuestion] = action.payload;
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < state.questions.length - 1) {
        state.currentQuestion += 1;
        state.timeRemaining = state.questions[state.currentQuestion].timeLimit;
      }
    },
    completeInterview: (state, action) => {
      state.isComplete = true;
      state.isActive = false;
      state.score = action.payload.score;
      state.summary = action.payload.summary;
    },
    resetInterview: () => initialState,
  },
});

export const {
  setCandidateInfo,
  setResumeUrl,
  startInterview,
  setTimeRemaining,
  submitAnswer,
  nextQuestion,
  completeInterview,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
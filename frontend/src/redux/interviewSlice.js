import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interviewSession: null,
  currentQuestionIndex: 0,
  answers: [],
  isRecording: false,
  loading: false,
  error: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviewSession: (state, action) => {
      state.interviewSession = action.payload;
      state.answers = new Array(action.payload.questions.length).fill(null);
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    submitAnswer: (state, action) => {
      state.answers[state.currentQuestionIndex] = action.payload;
    },
    setRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    resetInterview: (state) => {
      state.interviewSession = null;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.isRecording = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setInterviewSession,
  setCurrentQuestion,
  submitAnswer,
  setRecording,
  resetInterview,
  setError,
} = interviewSlice.actions;
export default interviewSlice.reducer;

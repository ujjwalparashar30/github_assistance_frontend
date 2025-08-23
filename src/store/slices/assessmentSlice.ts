import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AssessmentState {
  phase1Answers: Record<string, any>;
  phase2Answers: Record<string, any>;
  dynamicQuestions: any[];
  currentQuestionIndex: number;
  isSubmitting: boolean;
  progress: {
    phase1Complete: boolean;
    phase2Complete: boolean;
    resumeUploaded: boolean;
  };
}

const initialState: AssessmentState = {
  phase1Answers: {},
  phase2Answers: {},
  dynamicQuestions: [],
  currentQuestionIndex: 0,
  isSubmitting: false,
  progress: {
    phase1Complete: false,
    phase2Complete: false,
    resumeUploaded: false,
  },
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setPhase1Answer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      state.phase1Answers[action.payload.questionId] = action.payload.answer;
    },
    setPhase2Answer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      state.phase2Answers[action.payload.questionId] = action.payload.answer;
    },
    setDynamicQuestions: (state, action: PayloadAction<any[]>) => {
      state.dynamicQuestions = action.payload;
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    updateProgress: (state, action: PayloadAction<Partial<AssessmentState['progress']>>) => {
      state.progress = { ...state.progress, ...action.payload };
    },
    resetAssessment: () => initialState,
  },
});

export const {
  setPhase1Answer,
  setPhase2Answer,
  setDynamicQuestions,
  setCurrentQuestionIndex,
  setIsSubmitting,
  updateProgress,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;

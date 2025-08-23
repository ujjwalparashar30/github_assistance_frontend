import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  sessionId: string | null;
  isInitialized: boolean;
  currentStep: 'welcome' | 'assessment' | 'resume' | 'dynamic-questions' | 'dashboard';
}

const initialState: SessionState = {
  sessionId: null,
  isInitialized: false,
  currentStep: 'welcome',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
      state.isInitialized = true;
    },
    setCurrentStep: (state, action: PayloadAction<SessionState['currentStep']>) => {
      state.currentStep = action.payload;
    },
    resetSession: (state) => {
      state.sessionId = null;
      state.isInitialized = false;
      state.currentStep = 'welcome';
    },
  },
});

export const { setSessionId, setCurrentStep, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
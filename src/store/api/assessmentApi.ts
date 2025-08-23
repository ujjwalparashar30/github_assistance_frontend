import { baseApi } from './baseApi';

export interface Question {
  id: string;
  title: string;
  type: 'radio' | 'checkbox' | 'textarea';
  options?: string[] | { value: string; label: string }[];
  required?: boolean;
}

export interface AssessmentResponse {
  success: boolean;
  data: any;
  sessionId: string;
  message: string;
  nextStep?: string;
}

export const assessmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get initial 5 questions
    getQuestions: builder.query<{ success: boolean; data: Question[] }, void>({
      query: () => '/questions',
      providesTags: ['Questions'],
    }),

    // Submit initial answers
    submitAnswers: builder.mutation<AssessmentResponse, Record<string, any>>({
      query: (answers) => ({
        url: '/answers',
        method: 'POST',
        body: answers,
      }),
      invalidatesTags: ['Session'],
    }),

    // Generate dynamic questions after resume upload
    generateDynamicQuestions: builder.mutation<
      { success: boolean; data: any },
      { sessionId: string; questionAnswers: any }
    >({
      query: (data) => ({
        url: '/generate-questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Questions'],
    }),

    // Finalize analysis
    finalizeAnalysis: builder.mutation<
      { success: boolean; data: { finalAnalysis: any; githubIssues: any[] } },
      { sessionId: string; dynamicAnswers: any }
    >({
      query: (data) => ({
        url: '/finalize-analysis',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Analysis'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useSubmitAnswersMutation,
  useGenerateDynamicQuestionsMutation,
  useFinalizeAnalysisMutation,
} = assessmentApi;
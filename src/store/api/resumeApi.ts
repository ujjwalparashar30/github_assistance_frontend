import { baseApi } from './baseApi';

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadResume: builder.mutation<
      {
        success: boolean;
        sessionId: string;
        message: string;
        resumePreview: string;
        nextStep: string;
      },
      FormData
    >({
      query: (formData) => ({
        url: '/upload-resume',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Resume', 'Session'],
    }),
  }),
});

export const { useUploadResumeMutation } = resumeApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  credentials: 'include', // Important: includes cookies for session
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Session', 'Questions', 'Analysis', 'Resume'],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {} = baseApi;
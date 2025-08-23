// src/app/assessment/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetQuestionsQuery, useSubmitAnswersMutation } from '@/store/api/assessmentApi';
import { useDispatch } from 'react-redux';
import { setSessionId, setCurrentStep } from '@/store/slices/sessionSlice';
import { setPhase1Answer, updateProgress } from '@/store/slices/assessmentSlice';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AssessmentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { data: questionsData, isLoading, error } = useGetQuestionsQuery();
  const [submitAnswers, { isLoading: isSubmitting }] = useSubmitAnswersMutation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const questions = questionsData?.data || [];

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    dispatch(setPhase1Answer({ questionId, answer }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await submitAnswers(answers).unwrap();
      
      // Store session ID
      dispatch(setSessionId(result.sessionId));
      dispatch(updateProgress({ phase1Complete: true }));
      dispatch(setCurrentStep('resume'));
      
      // Navigate to resume upload
      router.push('/resume-upload');
    } catch (error) {
      console.error('Failed to submit answers:', error);
      // Handle error (show toast notification)
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Questions</h2>
          <p className="text-red-600">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Assessment</h1>
        <p className="text-gray-600">Help us understand your background and goals</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.title}</h2>
        
        {/* Question Input */}
        <div className="space-y-4">
          {currentQ.type === 'radio' && (
            <div className="space-y-3">
              {(currentQ.options || []).map((option, index) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                
                return (
                  <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={currentQ.id}
                      value={value}
                      checked={answers[currentQ.id] === value}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQ.type === 'checkbox' && (
            <div className="space-y-3">
              {(currentQ.options || []).map((option, index) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                const currentAnswers = answers[currentQ.id] || [];
                
                return (
                  <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={value}
                      checked={currentAnswers.includes(value)}
                      onChange={(e) => {
                        const newAnswers = e.target.checked 
                          ? [...currentAnswers, value]
                          : currentAnswers.filter((a: string) => a !== value);
                        handleAnswerChange(currentQ.id, newAnswers);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQ.type === 'textarea' && (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Type your answer here..."
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !answers[currentQ.id]}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Complete Assessment
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
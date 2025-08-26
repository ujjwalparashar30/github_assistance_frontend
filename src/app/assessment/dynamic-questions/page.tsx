'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerateDynamicQuestionsMutation } from '@/store/api/assessmentApi';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep } from '@/store/slices/sessionSlice';
import { setPhase2Answer, setDynamicQuestions, updateProgress, setCurrentQuestionIndex } from '@/store/slices/assessmentSlice';
import { ArrowLeft, ArrowRight, CheckCircle, Brain } from 'lucide-react';
import Link from 'next/link';
import type { RootState } from '@/store';

export default function DynamicQuestionsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { sessionId } = useSelector((state: RootState) => state.session);
  const { phase1Answers, dynamicQuestions, phase2Answers, currentQuestionIndex } = useSelector((state: RootState) => state.assessment);
  
  const [generateQuestions, { isLoading: isGenerating }] = useGenerateDynamicQuestionsMutation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate questions when component mounts
  useEffect(() => {
    const generateDynamicQuestions = async () => {
      if (!sessionId || dynamicQuestions.length > 0) return;

      try {
        setError(null);
        const result = await generateQuestions({
          sessionId,
          questionAnswers: phase1Answers
        }).unwrap();
        
        dispatch(setDynamicQuestions(result.data));
        dispatch(setCurrentStep('dynamic-questions'));
      } catch (err: any) {
        setError(err.data?.message || 'Failed to generate questions. Please try again.');
      }
    };

    generateDynamicQuestions();
  }, [sessionId, phase1Answers, dynamicQuestions.length, generateQuestions, dispatch]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    dispatch(setPhase2Answer({ questionId, answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < dynamicQuestions.length - 1) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex + 1));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(setCurrentQuestionIndex(currentQuestionIndex - 1));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Update progress and navigate to results
      dispatch(updateProgress({ phase2Complete: true }));
      dispatch(setCurrentStep('dashboard'));
      
      // Navigate to results page
      router.push('/assessment/results');
    } catch (err: any) {
      setError('Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while generating questions
  if (isGenerating || dynamicQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Personalized Questions</h1>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing your profile and creating tailored questions to better understand your goals...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && dynamicQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Generate Questions</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/assessment"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = dynamicQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / dynamicQuestions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/assessment" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessment
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalized Questions</h1>
        <p className="text-gray-600">AI-generated questions tailored to your profile and goals</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 text-sm mb-4">
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Initial Assessment
          </div>
          <div className="h-px flex-1 bg-gray-300"></div>
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Resume Upload
          </div>
          <div className="h-px flex-1 bg-gray-300"></div>
          <div className="flex items-center text-blue-600 font-medium">
            <div className="h-2 w-2 rounded-full bg-blue-600 mr-2"></div>
            Personalized Questions
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {dynamicQuestions.length}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.title}</h2>
        
        {/* Question Input */}
        <div className="space-y-4">
          {currentQuestion.type === 'radio' && (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option: any, index: number) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                
                return (
                  <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={value}
                      checked={phase2Answers[currentQuestion.id] === value}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option: any, index: number) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                const currentAnswers = phase2Answers[currentQuestion.id] || [];
                
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
                        handleAnswerChange(currentQuestion.id, newAnswers);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              value={phase2Answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Type your answer here..."
            />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        {currentQuestionIndex === dynamicQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !phase2Answers[currentQuestion.id]}
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
            disabled={!phase2Answers[currentQuestion.id]}
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

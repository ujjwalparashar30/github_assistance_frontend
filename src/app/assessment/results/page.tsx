'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinalizeAnalysisMutation } from '@/store/api/assessmentApi';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep, resetSession } from '@/store/slices/sessionSlice';
import { resetAssessment, updateProgress } from '@/store/slices/assessmentSlice';
import { ArrowLeft, Download, RefreshCw, ExternalLink, Star, GitFork, Eye, Calendar, CheckCircle, Brain, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { RootState } from '@/store';

interface GitHubProject {
  id: string;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  match_score: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { sessionId } = useSelector((state: RootState) => state.session);
  const { phase2Answers } = useSelector((state: RootState) => state.assessment);
  
  const [finalizeAnalysis, { isLoading: isAnalyzing }] = useFinalizeAnalysisMutation();
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [githubProjects, setGithubProjects] = useState<GitHubProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Finalize analysis when component mounts
  useEffect(() => {
    const runFinalAnalysis = async () => {
      if (!sessionId || analysis) return;

      try {
        setError(null);
        const result = await finalizeAnalysis({
          sessionId,
          dynamicAnswers: phase2Answers
        }).unwrap();
        
        setAnalysis(result.data.finalAnalysis);
        setGithubProjects(result.data.githubIssues || []);
        dispatch(updateProgress({ phase2Complete: true }));
        dispatch(setCurrentStep('dashboard'));
      } catch (err: any) {
        setError(err.data?.message || 'Failed to generate analysis. Please try again.');
      }
    };

    runFinalAnalysis();
  }, [sessionId, phase2Answers, analysis, finalizeAnalysis, dispatch]);

  const handleStartNew = () => {
    dispatch(resetSession());
    dispatch(resetAssessment());
    router.push('/');
  };

  const handleDownloadResults = () => {
    const resultsData = {
      analysis,
      recommendations: githubProjects,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(resultsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'career-assessment-results.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (isAnalyzing || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Analyzing Your Profile</h1>
          <p className="text-gray-600 mb-8">
            Our AI is processing your responses and finding the perfect GitHub projects for your skill level...
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Analysis Failed</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/assessment"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Start New Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
        <p className="text-xl text-gray-600">Here's your personalized career guidance and project recommendations</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={handleDownloadResults}
          className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Results
        </button>
        <button
          onClick={handleStartNew}
          className="inline-flex items-center border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Start New Assessment
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Analysis Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-3 text-blue-600" />
              Your Profile
            </h2>
            
            <div className="space-y-6">
              {analysis.skillLevel && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Skill Level</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(analysis.skillLevel)}`}>
                    {analysis.skillLevel}
                  </span>
                </div>
              )}

              {analysis.primaryInterests && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Primary Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.primaryInterests.map((interest: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.recommendedPath && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recommended Path</h3>
                  <p className="text-gray-600 text-sm">{analysis.recommendedPath}</p>
                </div>
              )}

              {analysis.nextSteps && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {analysis.nextSteps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GitHub Project Recommendations */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommended GitHub Projects ({githubProjects.length})
          </h2>
          
          {githubProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">No project recommendations available at this time.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {githubProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <a 
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 flex items-center"
                        >
                          {project.name}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{project.full_name}</p>
                      <p className="text-gray-700 mb-4">{project.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty_level)}`}>
                        {project.difficulty_level}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {project.match_score}% match
                      </span>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      {project.stargazers_count.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {project.forks_count.toLocaleString()}
                    </div>
                    {project.language && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
                        {project.language}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(project.updated_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Project Topics */}
                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.topics.slice(0, 5).map((topic, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                      {project.topics.length > 5 && (
                        <span className="text-gray-500 text-xs">+{project.topics.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

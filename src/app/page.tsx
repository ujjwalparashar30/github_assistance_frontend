'use client';

import Link from 'next/link';
import { ArrowRight, Brain, FileText, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Your Perfect
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Career Path</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          AI-powered career guidance platform that analyzes your skills, experience, and interests 
          to provide personalized recommendations and GitHub project suggestions.
        </p>
        <Link 
          href="/assessment" 
          className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Start Your Assessment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
          <p className="text-gray-600">
            Advanced AI analyzes your skills, experience, and career goals to provide personalized recommendations.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Resume Analysis</h3>
          <p className="text-gray-600">
            Upload your resume for detailed analysis and get insights on how to improve your profile.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">GitHub Projects</h3>
          <p className="text-gray-600">
            Get curated GitHub project recommendations based on your skill level and interests.
          </p>
        </div>
      </div>

      {/* How it Works */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Assessment', description: 'Answer 5 initial questions about your background and goals' },
            { step: '02', title: 'Resume Upload', description: 'Upload your resume for detailed analysis' },
            { step: '03', title: 'Personalized Questions', description: 'Get AI-generated questions based on your profile' },
            { step: '04', title: 'Career Dashboard', description: 'Receive your personalized career guidance and project recommendations' },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              {index < 3 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-indigo-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Career?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of professionals who have discovered their perfect career path with our AI-powered platform.
        </p>
        <Link 
          href="/assessment"
          className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
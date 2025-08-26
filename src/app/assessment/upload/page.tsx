'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadResumeMutation } from '@/store/api/resumeApi';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function ResumeUploadPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  // Supported file types
  const supportedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSizeInMB = 5;

  const validateFile = (file: File): string | null => {
    if (!supportedTypes.includes(file.type)) {
      return 'Please upload a PDF or Word document (.pdf, .doc, .docx)';
    }
    
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }
    
    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }
    
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const result = await uploadResume(formData).unwrap();
      
      // Store the preview and success state
      setResumePreview(result.resumePreview);
      
      // Auto-navigate to dynamic questions after short delay
      setTimeout(() => {
        router.push('/assessment/dynamic-questions');
      }, 2000);
      
    } catch (error: any) {
      setUploadError(error.data?.message || 'Failed to upload resume. Please try again.');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    setResumePreview(null);
  };

  // Success state - resume uploaded and processed
  if (resumePreview) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resume Uploaded Successfully!</h1>
          <p className="text-gray-600 mb-6">Analyzing your resume and generating personalized questions...</p>
          
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Resume Preview:</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded border text-left">
              {resumePreview}
            </p>
          </div>
          
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/assessment" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessment
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h1>
        <p className="text-gray-600">Help us provide more personalized recommendations by analyzing your experience</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Initial Assessment
          </div>
          <div className="h-px flex-1 bg-gray-300"></div>
          <div className="flex items-center text-blue-600 font-medium">
            <div className="h-2 w-2 rounded-full bg-blue-600 mr-2"></div>
            Resume Upload
          </div>
          <div className="h-px flex-1 bg-gray-300"></div>
          <div className="flex items-center text-gray-400">
            <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
            Personalized Questions
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your resume here, or click to browse
            </h3>
            <p className="text-gray-600 mb-4">
              Support for PDF, DOC, and DOCX files up to {maxSizeInMB}MB
            </p>
            
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected File */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-600">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading & Analyzing...
                </div>
              ) : (
                'Upload Resume'
              )}
            </button>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="mt-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Skip Option */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">Don't have a resume ready?</p>
        <Link
          href="/assessment/dynamic-questions"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Skip for now and continue with questions →
        </Link>
      </div>
    </div>
  );
}

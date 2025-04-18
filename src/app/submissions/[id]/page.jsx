'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { isAdmin } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubmissionDetails from '@/components/learning/SubmissionDetails';
import TaskSubmission from '@/components/learning/TaskSubmission';
import { FiArrowLeft, FiEdit, FiMessageSquare, FiSave, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function SubmissionDetailsPage({ params }) {
  const router = useRouter();
  const submissionId = params.id;
  const { user, isLoggedIn } = useAuthStore();
  const { currentSubmission, fetchSubmission, reviewSubmission, isLoading, error } = useSubmissionStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewData, setReviewData] = useState({
    feedback: '',
    grade: '',
    status: 'reviewed'
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const userIsAdmin = isAdmin();
  
  // Fetch submission on page load
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      
      if (submissionId) {
        await fetchSubmission(submissionId);
      }
    };
    
    fetchData();
  }, [isLoggedIn, submissionId, router, fetchSubmission]);
  
  // Initialize review data when submission loads
  useEffect(() => {
    if (currentSubmission) {
      setReviewData({
        feedback: currentSubmission.feedback || '',
        grade: currentSubmission.grade || '',
        status: currentSubmission.status || 'pending'
      });
    }
  }, [currentSubmission]);
  
  // Handle submission edit
  const handleEdit = () => {
    setIsEditMode(true);
    setIsReviewMode(false);
  };
  
  // Handle review mode toggle
  const handleToggleReviewMode = () => {
    setIsReviewMode(!isReviewMode);
    setIsEditMode(false);
  };
  
  // Handle review data change
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle review submission
  const handleSaveReview = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      // Convert grade to number if provided
      const parsedGrade = reviewData.grade === '' ? null : parseInt(reviewData.grade, 10);
      
      const success = await reviewSubmission(submissionId, {
        feedback: reviewData.feedback,
        grade: parsedGrade,
        status: reviewData.status,
        reviewedBy: user._id
      });
      
      if (success) {
        setIsReviewMode(false);
      }
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle edit completion
  const handleSubmitComplete = () => {
    setIsEditMode(false);
    fetchSubmission(submissionId);
  };
  
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back button and title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Link 
              href="/submissions" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiArrowLeft className="mr-1" />
              Back to Submissions
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              {currentSubmission?.taskId?.title || 'Submission Details'}
            </h1>
          </div>
          
          {/* Admin review button */}
          {userIsAdmin && currentSubmission && !isEditMode && !isReviewMode && (
            <button
              onClick={handleToggleReviewMode}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiMessageSquare className="mr-2" />
              {currentSubmission.feedback ? 'Edit Review' : 'Review Submission'}
            </button>
          )}
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Submission content */}
        {!isLoading && !error && currentSubmission && (
          <div className="space-y-6">
            {/* Edit mode */}
            {isEditMode ? (
              <TaskSubmission
                task={currentSubmission.taskId}
                user={user}
                batchId={currentSubmission.batchId}
                onSubmitComplete={handleSubmitComplete}
              />
            ) : isReviewMode ? (
              /* Review mode */
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Review Submission
                </h3>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSaveReview(); }}>
                  {/* Status */}
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={reviewData.status}
                      onChange={handleReviewChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Needs Revision</option>
                    </select>
                  </div>
                  
                  {/* Grade */}
                  <div className="mb-4">
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                      Grade (0-100)
                    </label>
                    <input
                      type="number"
                      id="grade"
                      name="grade"
                      value={reviewData.grade}
                      onChange={handleReviewChange}
                      min="0"
                      max="100"
                      placeholder="Enter grade (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Feedback */}
                  <div className="mb-6">
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      value={reviewData.feedback}
                      onChange={handleReviewChange}
                      rows="6"
                      placeholder="Enter feedback for the student..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsReviewMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          <span>Save Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* View mode */
              <SubmissionDetails
                submission={currentSubmission}
                onEdit={handleEdit}
                canEdit={
                  (currentSubmission.userId?._id === user._id || currentSubmission.userId === user._id) && 
                  (currentSubmission.status === 'pending' || currentSubmission.status === 'rejected')
                }
              />
            )}
            
            {/* Task Details (if available and not in edit mode) */}
            {!isEditMode && currentSubmission?.taskId && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Task Instructions
                </h3>
                <div className="prose prose-blue max-w-none">
                  {currentSubmission.taskId.content ? (
                    <div dangerouslySetInnerHTML={{ __html: currentSubmission.taskId.content }} />
                  ) : (
                    <p className="text-gray-700">
                      {currentSubmission.taskId.description || 'No instructions available for this task.'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 
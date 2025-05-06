'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FiCheck, FiClock, FiVideo, FiFileText, FiLink, FiDownload, FiCode, FiImage, FiFile, 
         FiUpload, FiEdit, FiChevronDown, FiChevronUp, FiCheckCircle, FiTrash2, FiLock } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useSubmissionStore } from '@/store/submissionStore';
import TaskSubmission from './TaskSubmission';
import SubmissionDetails from './SubmissionDetails';

export default function TaskContent({ task, isCompleted, onToggleComplete }) {
  const [isLoading, setIsLoading] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { user } = useAuthStore();
  const { 
    fetchUserSubmissions, 
    createSubmission, 
    updateSubmission,
    deleteSubmission,
    isLoading: submissionLoading 
  } = useSubmissionStore();

  // Add debug logging when task changes
  useEffect(() => {
    if (task) {
      console.log('TaskContent received task:', task);
      console.log('Task fields:', Object.keys(task));
    }
  }, [task]);

  // Fetch any existing submission for this task when task changes
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!task?._id || !user?._id) return;
      
      try {
        const submissions = await fetchUserSubmissions({
          userId: user._id,
          taskId: task._id
        });
        
        if (submissions.length > 0) {
          setSubmission(submissions[0]);
        } else {
          setSubmission(null);
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };
    
    fetchSubmission();
  }, [task, user, fetchUserSubmissions]);

  // Handle task completion toggle
  const handleToggleCompletion = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggleComplete(!isCompleted);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission submission/update
  const handleSubmitComplete = (newSubmission) => {
    setSubmission(newSubmission);
    setIsEditMode(false);
    setShowSubmissionForm(false);
    
    // If task is not already marked as complete, mark it as complete
    if (!isCompleted) {
      onToggleComplete(true);
    }
  };
  
  // Handle edit button click
  const handleEditSubmission = () => {
    setIsEditMode(true);
    setShowSubmissionForm(true);
  };
  
  // Handle delete button click
  const handleDeleteSubmission = async () => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const success = await deleteSubmission(submission._id);
        if (success) {
          setSubmission(null);
          setShowSubmissionForm(false);
        }
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  const renderContentSection = (content, index) => {
    switch (content.type) {
      case 'video':
        return content.videoUrl && content.videoUrl.trim() !== "" && (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Video Content</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <iframe 
                src={content.videoUrl} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-56 md:h-72 lg:h-96"
              ></iframe>
            </div>
          </div>
        );
      
      case 'assignment':
        return content.assignment && (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Assignment</h2>
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>{content.assignment}</ReactMarkdown>
            </div>
          </div>
        );
      
      case 'reading':
        return content.readingContent && (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Reading Material</h2>
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>{content.readingContent}</ReactMarkdown>
            </div>
          </div>
        );
      
      case 'project':
        return content.projectDetails && (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Project Details</h2>
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown>{content.projectDetails}</ReactMarkdown>
            </div>
          </div>
        );
      
      case 'quiz':
        return content.quiz && content.quiz.length > 0 && (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz</h2>
            <div className="space-y-6">
              {content.quiz.map((question, qIndex) => (
                <div key={qIndex} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          id={`option-${qIndex}-${oIndex}`}
                          className="mr-2"
                        />
                        <label htmlFor={`option-${qIndex}-${oIndex}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!task) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">No task selected</h2>
        <p className="text-gray-600">
          Please select a task from the sidebar to view its content.
        </p>
      </div>
    );
  }

  // Handle placeholder "Coming Soon" tasks
  if (task.isPlaceholder) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Placeholder header */}
          <div className="relative h-48 bg-gradient-to-r from-gray-600 to-gray-800">
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="flex items-center mb-2">
                <div className="px-3 py-1 text-xs font-medium rounded-full bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
                <div className="text-xs text-white ml-3">Day {task.dayNumber || 1}</div>
              </div>
              <h1 className="text-2xl font-bold text-white">Content Coming Soon</h1>
            </div>
          </div>

          {/* Placeholder content */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h2>
              <p className="text-gray-700">
                This content will be available at a later date. Please check back later.
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <div className="max-w-md p-6 bg-gray-50 rounded-lg text-center">
                <FiLock className="mx-auto mb-4 text-gray-400 text-4xl" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Content Locked</h3>
                <p className="text-gray-600">
                  The instructor has not released this content yet. Please continue with other available tasks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task content section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Task header */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
          {task.images && task.images.length > 0 && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={task.images[0]}
                alt={task.title}
                className="object-cover w-full h-full mix-blend-overlay opacity-50"
              />
            </div>
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex items-center mb-2">
              <div className={`
                px-3 py-1 text-xs font-medium rounded-full
                ${isCompleted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
                }
              `}>
                {isCompleted ? 'Completed' : 'In Progress'}
              </div>
              <div className="text-xs text-white ml-3">Day {task.dayNumber || 1}</div>
              <div className="flex gap-2 ml-3">
                {task.contents && task.contents.map((content, index) => (
                  <div key={index} className="text-xs text-white bg-blue-700 px-2 py-0.5 rounded-full">
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </div>
                ))}
              </div>
              {submission && (
                <div className="text-xs text-white ml-3 bg-blue-700 px-2 py-0.5 rounded-full">
                  Submitted
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{task.title}</h1>
          </div>
        </div>

        {/* Task content */}
        <div className="p-6">
          {/* Task description */}
          {task.description && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700">{task.description}</p>
            </div>
          )}

          {/* Render all content types */}
          {task.contents && task.contents.map((content, index) => renderContentSection(content, index))}

          {/* Resources section */}
          {task.resources && task.resources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resources</h2>
              <div className="space-y-2">
                {task.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FiLink className="mr-2" />
                    {resource}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Code snippets section */}
          {task.codeSnippets && task.codeSnippets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Code Snippets</h2>
              <div className="space-y-4">
                {task.codeSnippets.map((snippet, index) => (
                  <pre key={index} className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                    <code>{snippet}</code>
                  </pre>
                ))}
              </div>
            </div>
          )}

          {/* Images section */}
          {task.images && task.images.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.images.map((imageUrl, index) => (
                  <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden h-48">
                    <img 
                      src={imageUrl} 
                      alt={`Image ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDFs section */}
          {task.pdfs && task.pdfs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">PDF Documents</h2>
              <div className="space-y-2">
                {task.pdfs.map((pdf, index) => (
                  <a
                    key={index}
                    href={pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FiFile className="mr-2" />
                    {pdf.split('/').pop()}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submission section */}
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {submission ? 'Your Submission' : 'Submit Your Work'}
              </h2>
              
              <div className="flex gap-2">
                {submission ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSubmission}
                      className="flex items-center justify-center px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
                      disabled={submission.status === 'approved'}
                    >
                      <FiEdit className="mr-2" />
                      Edit Submission
                    </button>
                    <button
                      onClick={handleDeleteSubmission}
                      className="flex items-center justify-center px-4 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-700"
                      disabled={submission.status === 'approved'}
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                    className="flex items-center justify-center px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <FiUpload className="mr-2" />
                    Submit Task Work
                  </button>
                )}
              </div>
            </div>

            {submission && !showSubmissionForm && (
              <SubmissionDetails submission={submission} />
            )}
          </div>
        </div>
      </div>

      {/* Submission form */}
      {showSubmissionForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <TaskSubmission
            task={task}
            user={user}
            batchId={task.batchId}
            existingSubmission={isEditMode ? submission : null}
            onSubmitComplete={handleSubmitComplete}
          />
        </div>
      )}
    </div>
  );
} 
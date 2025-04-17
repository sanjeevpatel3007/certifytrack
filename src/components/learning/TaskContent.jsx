'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FiCheck, FiClock, FiVideo, FiFileText, FiLink, FiDownload, FiCode, FiImage, FiFile } from 'react-icons/fi';

export default function TaskContent({ task, isCompleted, onToggleComplete }) {
  const [isLoading, setIsLoading] = useState(false);

  // Add debug logging when task changes
  useEffect(() => {
    if (task) {
      console.log('TaskContent received task:', task);
      console.log('Task fields:', Object.keys(task));
    }
  }, [task]);

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

  return (
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
            <div className="text-xs text-white ml-3">{task.contentType}</div>
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

        {/* Video content */}
        {task.videoUrl && task.videoUrl.trim() !== "" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Video</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <iframe 
                src={task.videoUrl} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-56 md:h-72 lg:h-96"
              ></iframe>
            </div>
          </div>
        )}

        {/* Task content - using description if content is missing */}
        {task.content && (
          <div className="prose prose-blue max-w-none mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Content</h2>
            <ReactMarkdown>{task.content}</ReactMarkdown>
          </div>
        )}

        {/* Images */}
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

        {/* PDFs */}
        {task.pdfs && task.pdfs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">PDF Documents</h2>
            <div className="space-y-3">
              {task.pdfs.map((pdfUrl, index) => (
                <a
                  key={index}
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                    <FiFile />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">PDF Document {index + 1}</div>
                    <div className="text-sm text-gray-500 truncate max-w-sm">{pdfUrl}</div>
                  </div>
                  <FiDownload className="ml-auto text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Assignment */}
        {task.assignment && task.assignment.trim() !== "" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Assignment</h2>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-800">{task.assignment}</p>
            </div>
          </div>
        )}

        {/* Code Snippets */}
        {task.codeSnippets && task.codeSnippets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Code Snippets</h2>
            <div className="space-y-4">
              {task.codeSnippets.map((snippet, index) => (
                <div key={index} className="overflow-x-auto">
                  <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm">{snippet}</pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources - handle both string[] and object[] formats */}
        {task.resources && task.resources.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resources</h2>
            <div className="space-y-3">
              {task.resources.map((resource, index) => {
                // Handle if resources is a string array
                if (typeof resource === 'string') {
                  return (
                    <a
                      key={index}
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                        <FiLink />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Resource {index + 1}</div>
                        <div className="text-sm text-gray-500 truncate max-w-sm">{resource}</div>
                      </div>
                    </a>
                  );
                }
                
                // Handle if resources is an object array
                const Icon = resource.type === 'video' 
                  ? FiVideo 
                  : resource.type === 'document' 
                    ? FiFileText
                    : FiLink;
                
                return (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                      <Icon />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                    </div>
                    {resource.type === 'document' && (
                      <FiDownload className="ml-auto text-gray-400" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Quiz - if it exists */}
        {task.quiz && task.quiz.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quiz</h2>
            <div className="space-y-6">
              {task.quiz.map((quizItem, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-gray-900 mb-3">{index + 1}. {quizItem.question}</p>
                  <div className="space-y-2 ml-4">
                    {quizItem.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center">
                        <input 
                          type="radio" 
                          id={`question-${index}-option-${optIndex}`} 
                          name={`question-${index}`} 
                          className="mr-2"
                        />
                        <label htmlFor={`question-${index}-option-${optIndex}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task actions */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleToggleCompletion}
            disabled={isLoading}
            className={`
              w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-md font-medium
              ${isCompleted
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-600 text-white hover:bg-green-700'
              }
              transition-colors
            `}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Updating...</span>
              </span>
            ) : isCompleted ? (
              <span className="flex items-center">
                <FiClock className="mr-2" />
                <span>Mark as Incomplete</span>
              </span>
            ) : (
              <span className="flex items-center">
                <FiCheck className="mr-2" />
                <span>Mark as Complete</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 
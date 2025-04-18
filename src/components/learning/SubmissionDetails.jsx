'use client';

import { FiPaperclip, FiLink, FiClock, FiCheckCircle, FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { formatSubmissionDate, getSubmissionStatusLabel } from '@/lib/submissionUtils';

export default function SubmissionDetails({ submission, onEdit, canEdit = true }) {
  if (!submission) return null;
  
  const { content, files, links, status, feedback, grade, submittedAt, reviewedAt } = submission;
  
  // Status badge styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="mr-1" />;
      case 'reviewed':
      case 'approved':
        return <FiCheckCircle className="mr-1" />;
      case 'rejected':
        return <FiAlertTriangle className="mr-1" />;
      default:
        return <FiClock className="mr-1" />;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Submission header */}
      <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Submission Details</h3>
          <p className="text-sm text-gray-600">
            Submitted on {formatSubmissionDate(submittedAt)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Status badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            {getSubmissionStatusLabel(status)}
          </span>
          
          {/* Edit button (if allowed) */}
          {canEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiEdit className="mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>
      
      {/* Submission content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        {content && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Description</h4>
            <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded">
              {content}
            </div>
          </div>
        )}
        
        {/* Files */}
        {files && files.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Files</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                  <FiPaperclip className="text-gray-500" />
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Links */}
        {links && links.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Links</h4>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index} className="flex items-start space-x-2 bg-gray-50 p-2 rounded-md">
                  <FiLink className="text-gray-500 mt-1" />
                  <div>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link.url}
                    </a>
                    {link.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {link.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Feedback section (if reviewed) */}
        {(status === 'reviewed' || status === 'approved' || status === 'rejected') && (
          <div className="border-t border-gray-200 pt-4 mt-6">
            <h4 className="font-medium text-gray-700 mb-2">Instructor Feedback</h4>
            
            {/* Grade (if available) */}
            {grade !== null && grade !== undefined && (
              <div className="mb-3">
                <span className="font-medium text-gray-600">Grade: </span>
                <span className="text-lg font-semibold">{grade}/100</span>
              </div>
            )}
            
            {/* Feedback text */}
            {feedback ? (
              <div className="bg-gray-50 p-4 rounded">
                {feedback}
              </div>
            ) : (
              <p className="text-gray-500 italic">No feedback provided yet.</p>
            )}
            
            {/* Review date */}
            {reviewedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Reviewed on {formatSubmissionDate(reviewedAt)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
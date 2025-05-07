'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FiChevronDown, FiChevronRight, FiInfo, FiCheck, FiX, 
  FiMessageCircle, FiEye, FiFilter
} from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';

// The main component that uses useSearchParams
function SubmissionsContent() {
  const searchParams = useSearchParams();
  const batchIdParam = searchParams.get('batchId');
  const statusParam = searchParams.get('status');
  const userIdParam = searchParams.get('userId');

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch all submissions for a batch with optional status filter
  const fetchBatchSubmissions = async (batchId, status = '') => {
    setLoading(true);
    setError('');
    
    try {
      let url = `/api/admin/submissions?batchId=${batchId}`;
      if (status) url += `&status=${status}`;
      if (userIdParam) url += `&userId=${userIdParam}`;
      
      console.log('Fetching submissions with URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      if (data.success && data.submissions) {
        console.log('Submissions fetched:', data.submissions.length);
        setSubmissions(data.submissions);
      } else {
        console.error('Failed to fetch submissions:', data);
        setError('Failed to load submissions. Please try again later.');
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error fetching batch submissions:', error);
      setError('An error occurred while fetching submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submissions for a selected task
  const fetchTaskSubmissions = async (taskId) => {
    setLoading(true);
    setError('');
    setSelectedTask(taskId);
    setCurrentSubmission(null);
    
    try {
      const status = statusFilter === 'all' ? '' : statusFilter;
      const response = await fetch(`/api/admin/submissions?taskId=${taskId}&status=${status}`);
      const data = await response.json();
      if (data.success && data.submissions) {
        setSubmissions(data.submissions);
      } else {
        setError('Failed to load task submissions');
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('An error occurred while fetching task submissions');
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks for a selected batch
  const fetchBatchTasks = async (batchId) => {
    setLoading(true);
    setError('');
    setSelectedBatch(batchId);
    setSelectedTask(null);
    setSubmissions([]);
    
    try {
      const response = await fetch(`/api/tasks?batchId=${batchId}`);
      const data = await response.json();
      
      // The tasks API might return { tasks: [...], success: true }
      if ((data.success && data.tasks) || (data.tasks && Array.isArray(data.tasks))) {
        console.log('Tasks fetched:', data.tasks.length);
        setTasks(data.tasks);
        
        // Fetch all submissions for this batch
        const statusToUse = statusParam || (statusFilter !== 'all' ? statusFilter : '');
        await fetchBatchSubmissions(batchId, statusToUse);
      } else {
        console.error('Failed to fetch tasks:', data);
        setError('Failed to load tasks for this batch');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('An error occurred while fetching tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize with URL parameters
  useEffect(() => {
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [statusParam]);

  // Fetch all batches on component mount
  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/admin/batches');
        const data = await response.json();
        
        // The batches API returns { batches: [...] } without a success field
        if (data.batches && Array.isArray(data.batches)) {
          console.log('Batches fetched:', data.batches.length);
          setBatches(data.batches);
          
          // If batchId is provided in URL, select it
          if (batchIdParam) {
            const selectedBatch = data.batches.find(b => b._id === batchIdParam);
            setSelectedBatch(batchIdParam);
            
            if (selectedBatch) {
              console.log('Selected batch:', selectedBatch.title);
              // We need to call the function directly here, not reference it
              await fetchBatchTasks(batchIdParam);
            } else {
              console.error('Batch not found with ID:', batchIdParam);
              setError(`Batch with ID ${batchIdParam} not found`);
            }
          }
        } else {
          console.error('Unexpected batches response format:', data);
          setError('Failed to load batches. Please try again later.');
          setBatches([]);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
        setError('An error occurred while fetching batches');
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBatches();
    // Don't include fetchBatchTasks in dependencies as it causes infinite loop
  }, [batchIdParam, statusParam, userIdParam]);

  // Review a submission (approve/reject)
  const reviewSubmission = async (submissionId, status) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          feedback: feedbackText
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the submission in the list
        setSubmissions(prev => 
          prev.map(sub => sub._id === submissionId ? {...sub, status, feedback: feedbackText} : sub)
        );
        
        // Update current submission if it's the one being reviewed
        if (currentSubmission && currentSubmission._id === submissionId) {
          setCurrentSubmission({...currentSubmission, status, feedback: feedbackText});
        }
        
        // Clear feedback
        setFeedbackText('');
      } else {
        setError('Failed to update submission status');
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
      setError('An error occurred while updating the submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    
    if (selectedTask) {
      // Refetch for selected task with new status
      fetchTaskSubmissions(selectedTask);
    } else if (selectedBatch) {
      // Refetch for selected batch with new status
      fetchBatchSubmissions(selectedBatch, newStatus === 'all' ? '' : newStatus);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review Submissions</h1>
        
        {/* Status filter dropdown */}
        {submissions.length > 0 && (
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="bg-white border rounded-md text-sm px-3 py-1.5"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Batch Selection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Select Batch</h2>
        {loading && batches.length === 0 ? (
          <div className="text-gray-500">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No batches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map(batch => (
              <button
                key={batch._id}
                onClick={() => fetchBatchTasks(batch._id)}
                className={`p-4 border rounded-lg text-left hover:bg-blue-50 transition-colors ${
                  selectedBatch === batch._id ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                <h3 className="font-medium text-gray-900">{batch.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {batch.startDate ? formatDate(batch.startDate) : 'No start date'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Tasks for Selected Batch */}
      {selectedBatch && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedTask ? 'Selected Task' : 'All Tasks'} 
            {selectedTask && (
              <button 
                onClick={() => {
                  setSelectedTask(null);
                  fetchBatchSubmissions(selectedBatch);
                }}
                className="ml-2 text-sm text-blue-600 font-normal"
              >
                (View all tasks)
              </button>
            )}
          </h2>
          
          {loading && tasks.length === 0 ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <div className="space-y-2">
              {!selectedTask && (
                <p className="text-sm text-gray-500 mb-4">
                  Showing all submissions for this batch. Select a specific task to filter.
                </p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tasks.map(task => (
                  <button
                    key={task._id}
                    onClick={() => fetchTaskSubmissions(task._id)}
                    className={`flex flex-col p-4 border rounded-lg text-left hover:bg-blue-50 transition-colors ${
                      selectedTask === task._id ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Day {task.dayNumber || '1'} • {task.contentType || 'Task'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 bg-gray-50 rounded-lg">
              <FiInfo className="text-gray-400 mr-2" />
              <p className="text-gray-500">No tasks found for this batch</p>
            </div>
          )}
        </div>
      )}
      
      {/* Submissions */}
      {selectedBatch && submissions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Submissions 
              {statusFilter !== 'all' && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (Filtered by: {statusFilter})
                </span>
              )}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="space-y-2 lg:border-r lg:pr-6">
              {submissions.map(submission => (
                <div
                  key={submission._id}
                  onClick={() => setCurrentSubmission(submission)}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    currentSubmission && currentSubmission._id === submission._id
                      ? 'border-blue-300 bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {submission.userId?.name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {submission.userId?.email || 'No email'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Task: {submission.taskId?.title || 'Unknown Task'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Submitted: {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(submission.status)}`}>
                      {submission.status === 'pending' ? 'Pending' : 
                       submission.status === 'approved' ? 'Approved' : 
                       submission.status === 'rejected' ? 'Rejected' : 'Unknown'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Submission Details */}
            {currentSubmission ? (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">Submission Details</h3>
                  <p className="text-sm text-gray-500">
                    From: {currentSubmission.userId?.name || 'Unknown'} ({currentSubmission.userId?.email || 'No email'})
                  </p>
                  <p className="text-sm text-gray-500">
                    Task: {currentSubmission.taskId?.title || 'Unknown Task'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {formatDate(currentSubmission.submittedAt)}
                  </p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(currentSubmission.status)}`}>
                      {currentSubmission.status === 'pending' ? 'Pending Review' : 
                       currentSubmission.status === 'approved' ? 'Approved' : 
                       currentSubmission.status === 'rejected' ? 'Needs Revision' : 'Unknown'}
                    </span>
                  </div>
                </div>
                
                {/* Submission Content */}
                <div>
                  <h4 className="font-medium mb-2">Submission Content</h4>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap">
                    {currentSubmission.content || 'No content provided'}
                  </div>
                </div>
                
                {/* Links */}
                {currentSubmission.links && currentSubmission.links.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Links</h4>
                    <div className="space-y-2">
                      {currentSubmission.links.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 border rounded bg-white hover:bg-blue-50 text-blue-600"
                        >
                          <FiEye className="mr-2" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Files */}
                {currentSubmission.files && currentSubmission.files.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Files</h4>
                    <div className="space-y-2">
                      {currentSubmission.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.url || file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-2 border rounded bg-white hover:bg-blue-50"
                        >
                          <FiEye className="mr-2 text-blue-600" />
                          {file.name || `File ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Feedback */}
                <div>
                  <h4 className="font-medium mb-2">Feedback</h4>
                  <textarea
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder="Enter feedback for the student..."
                    className="w-full border rounded-lg p-3 min-h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Review Actions */}
                <div className="flex space-x-3 mt-4 pt-4 border-t">
                  <button
                    onClick={() => reviewSubmission(currentSubmission._id, 'approved')}
                    disabled={isSubmitting || currentSubmission.status === 'approved'}
                    className={`flex items-center px-4 py-2 rounded-md font-medium text-white ${
                      currentSubmission.status === 'approved'
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <FiCheck className="mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => reviewSubmission(currentSubmission._id, 'rejected')}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    <FiX className="mr-2" />
                    Request Revision
                  </button>
                </div>
                
                {/* Previous Feedback */}
                {currentSubmission.feedback && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiMessageCircle className="text-blue-500 mr-2" />
                      <h4 className="font-medium">Previous Feedback</h4>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{currentSubmission.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <FiInfo className="mx-auto text-gray-400 text-2xl mb-2" />
                  <p className="text-gray-500">Select a submission to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* No submissions found */}
      {selectedBatch && submissions.length === 0 && !loading && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
            <FiInfo className="text-gray-400 mr-2" />
            <p className="text-gray-500">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} submissions found` 
                : 'No submissions found'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading fallback
function SubmissionsLoading() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <p className="text-gray-500">Loading submissions data...</p>
    </div>
  );
}

// Main page component with Suspense
export default function ManageSubmissionsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<SubmissionsLoading />}>
        <SubmissionsContent />
      </Suspense>
    </AdminLayout>
  );
} 
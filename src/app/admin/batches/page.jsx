'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiChevronDown, FiChevronRight, FiUsers, FiClipboard, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';

export default function BatchesListPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [batchData, setBatchData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch('/api/admin/batches');
        
        if (!response.ok) {
          throw new Error('Failed to fetch batches');
        }
        
        const data = await response.json();
        setBatches(data.batches || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching batches:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBatches();
  }, []);
  
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        const response = await fetch(`/api/admin/batches/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete batch');
        }
        
        // Remove the deleted batch from state
        setBatches(batches.filter(batch => batch._id !== id));
      } catch (err) {
        alert('Error deleting batch: ' + err.message);
        console.error('Error deleting batch:', err);
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchBatchDetails = async (batchId) => {
    if (expandedBatch === batchId) {
      setExpandedBatch(null);
      return;
    }

    setExpandedBatch(batchId);
    setLoadingData(true);
    try {
      // Fetch enrollments
      const enrollmentsResponse = await fetch(`/api/admin/enrollments?batchId=${batchId}`);
      const enrollmentsData = await enrollmentsResponse.json();
      
      // Fetch all submissions for this batch
      const submissionsResponse = await fetch(`/api/admin/submissions?batchId=${batchId}`);
      const submissionsData = await submissionsResponse.json();
      
      // Calculate stats
      const enrolledCount = enrollmentsData.enrollments?.length || 0;
      
      // Calculate submissions stats
      const submissionStats = {
        total: submissionsData.submissions?.length || 0,
        pending: submissionsData.submissions?.filter(s => s.status === 'pending')?.length || 0,
        approved: submissionsData.submissions?.filter(s => s.status === 'approved')?.length || 0,
        rejected: submissionsData.submissions?.filter(s => s.status === 'rejected')?.length || 0
      };
      
      // Group submissions by task
      const submissionsByTask = {};
      submissionsData.submissions?.forEach(submission => {
        const taskId = submission.taskId?._id;
        if (!taskId) return;
        
        if (!submissionsByTask[taskId]) {
          submissionsByTask[taskId] = {
            taskName: submission.taskId?.title || 'Unknown Task',
            submissions: []
          };
        }
        submissionsByTask[taskId].submissions.push(submission);
      });
      
      setBatchData({
        ...batchData,
        [batchId]: {
          enrollments: enrollmentsData.enrollments || [],
          submissionStats,
          submissionsByTask
        }
      });
    } catch (error) {
      console.error('Error fetching batch details:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Batches</h1>
        <Link
          href="/admin/batches/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Batch
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg">Loading batches...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg mb-4">No batches found</p>
          <Link
            href="/admin/batches/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Your First Batch
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map((batch) => (
                <>
                  <tr 
                    key={batch._id} 
                    className={`hover:bg-gray-50 cursor-pointer ${expandedBatch === batch._id ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchBatchDetails(batch._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={batch.bannerImage || '/placeholder.png'} 
                            alt={batch.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {batch.title}
                            {expandedBatch === batch._id ? (
                              <FiChevronDown className="ml-2" />
                            ) : (
                              <FiChevronRight className="ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{batch.instructor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{batch.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(batch.startDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{batch.durationDays} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        batch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {batch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/batches/${batch._id}`);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/batches/${batch._id}/edit`);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(batch._id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded row with enrollment and submission data */}
                  {expandedBatch === batch._id && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50 border-b">
                        {loadingData ? (
                          <div className="text-center py-4">
                            <p>Loading batch details...</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Stats summary */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                <div className="rounded-full bg-blue-100 p-3 mr-3">
                                  <FiUsers className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Enrolled Students</p>
                                  <p className="font-bold text-lg">
                                    {batchData[batch._id]?.enrollments?.length || 0}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                <div className="rounded-full bg-green-100 p-3 mr-3">
                                  <FiClipboard className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Total Submissions</p>
                                  <p className="font-bold text-lg">
                                    {batchData[batch._id]?.submissionStats?.total || 0}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                <div className="rounded-full bg-yellow-100 p-3 mr-3">
                                  <FiClock className="text-yellow-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Pending Review</p>
                                  <p className="font-bold text-lg">
                                    {batchData[batch._id]?.submissionStats?.pending || 0}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                <div className="rounded-full bg-green-100 p-3 mr-3">
                                  <FiCheckCircle className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Approved Submissions</p>
                                  <p className="font-bold text-lg">
                                    {batchData[batch._id]?.submissionStats?.approved || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3">
                              <Link
                                href={`/admin/enrollments?batchId=${batch._id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
                              >
                                <FiUsers className="mr-2" />
                                View All Students
                              </Link>
                              
                              <Link
                                href={`/admin/submissions?batchId=${batch._id}`}
                                className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
                              >
                                <FiClipboard className="mr-2" />
                                View All Submissions
                              </Link>
                              
                              <Link
                                href={`/admin/submissions?batchId=${batch._id}&status=pending`}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
                              >
                                <FiAlertCircle className="mr-2" />
                                Review Pending Submissions
                              </Link>
                            </div>
                            
                            {/* Enrolled students preview */}
                            {batchData[batch._id]?.enrollments?.length > 0 && (
                              <div>
                                <h3 className="font-medium mb-2">Enrolled Students Preview</h3>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Progress</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {batchData[batch._id].enrollments.slice(0, 5).map(enrollment => (
                                        <tr key={enrollment._id} className="border-b">
                                          <td className="px-4 py-2 text-sm">{enrollment.userId?.name || 'Unknown'}</td>
                                          <td className="px-4 py-2 text-sm">{enrollment.userId?.email || 'N/A'}</td>
                                          <td className="px-4 py-2">
                                            <div className="flex items-center">
                                              <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                  className="bg-blue-600 h-2 rounded-full" 
                                                  style={{ width: `${enrollment.progress || 0}%` }}>
                                                </div>
                                              </div>
                                              <span className="ml-2 text-xs">{enrollment.progress || 0}%</span>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                {batchData[batch._id].enrollments.length > 5 && (
                                  <div className="text-center mt-2">
                                    <Link 
                                      href={`/admin/enrollments?batchId=${batch._id}`}
                                      className="text-blue-600 text-sm hover:underline"
                                    >
                                      View all {batchData[batch._id].enrollments.length} students
                                    </Link>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Recent submissions */}
                            {batchData[batch._id]?.submissionStats?.total > 0 && (
                              <div>
                                <h3 className="font-medium mb-2">Recent Submissions</h3>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Task</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Student</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Submitted</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.values(batchData[batch._id]?.submissionsByTask || {})
                                        .flatMap(task => task.submissions)
                                        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                                        .slice(0, 5)
                                        .map(submission => (
                                          <tr key={submission._id} className="border-b">
                                            <td className="px-4 py-2 text-sm">{submission.taskId?.title || 'Unknown'}</td>
                                            <td className="px-4 py-2 text-sm">{submission.userId?.name || 'Unknown'}</td>
                                            <td className="px-4 py-2">
                                              <span className={`px-2 py-1 text-xs rounded-full ${
                                                submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                              }`}>
                                                {submission.status === 'approved' ? 'Approved' :
                                                 submission.status === 'rejected' ? 'Needs Revision' :
                                                 'Pending'}
                                              </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm">
                                              {formatDate(submission.submittedAt)}
                                            </td>
                                          </tr>
                                        ))
                                      }
                                    </tbody>
                                  </table>
                                </div>
                                <div className="text-center mt-2">
                                  <Link 
                                    href={`/admin/submissions?batchId=${batch._id}`}
                                    className="text-blue-600 text-sm hover:underline"
                                  >
                                    View all submissions
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
} 
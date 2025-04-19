'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiUsers, FiChevronDown, FiChevronRight, FiInfo, FiCheckCircle, FiFile } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';

export default function BatchEnrollmentsPage() {
  const searchParams = useSearchParams();
  const batchIdParam = searchParams.get('batchId');
  
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [error, setError] = useState('');

  // Fetch enrollments for a specific batch
  const fetchBatchEnrollments = async (batchId) => {
    if (!batchId) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching enrollments for batch:', batchId);
      const response = await fetch(`/api/admin/enrollments?batchId=${batchId}`);
      const data = await response.json();
      
      if (data.success && data.enrollments) {
        console.log('Enrollments fetched:', data.enrollments.length);
        setEnrollments(data.enrollments);
        // Find the batch in our list of batches
        const batch = batches.find(b => b._id === batchId);
        setSelectedBatch(batch || null);
        setExpandedBatch(batchId);
      } else {
        console.error('Failed to fetch enrollments:', data);
        setError('Failed to load enrollments. Please try again later.');
        setEnrollments([]);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      setError('An error occurred while fetching enrollments');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

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
          
          // If batchId is provided in URL, expand it
          if (batchIdParam) {
            setExpandedBatch(batchIdParam);
            // We need to set the selected batch first based on the fetched batches
            const batch = data.batches.find(b => b._id === batchIdParam);
            setSelectedBatch(batch || null);
            
            // Then fetch the enrollments for that batch
            await fetchBatchEnrollments(batchIdParam);
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
  }, [batchIdParam]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBatchClick = (batchId) => {
    if (expandedBatch === batchId) {
      // If already expanded, collapse it
      setExpandedBatch(null);
    } else {
      // Otherwise fetch enrollments and expand
      fetchBatchEnrollments(batchId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Batch Enrollments</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {loading && batches.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Loading batches...</p>
          </div>
        ) : (
          <>
            {/* Batches List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">All Batches</h2>
              
              {batches.length === 0 && !loading ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500">No batches found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {batches.map(batch => (
                    <div key={batch._id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleBatchClick(batch._id)}
                        className={`w-full flex items-center justify-between p-4 text-left ${
                          expandedBatch === batch._id ? 'bg-blue-50' : 'bg-white'
                        }`}
                      >
                        <div>
                          <span className="font-medium">{batch.title}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {batch.startDate ? formatDate(batch.startDate) : 'No start date'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            <FiUsers className="mr-1" />
                            <span>{batch.enrollmentCount || (expandedBatch === batch._id ? enrollments.length : 0)}</span>
                          </div>
                          {expandedBatch === batch._id ? (
                            <FiChevronDown className="text-gray-500" />
                          ) : (
                            <FiChevronRight className="text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {/* Enrollments for selected batch */}
                      {expandedBatch === batch._id && (
                        <div className="p-4 bg-gray-50 border-t">
                          {loading ? (
                            <div className="text-center py-4">
                              <p className="text-gray-500">Loading enrollments...</p>
                            </div>
                          ) : enrollments.length > 0 ? (
                            <div>
                              {/* Batch stats summary */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                  <div className="rounded-full bg-blue-100 p-3 mr-3">
                                    <FiUsers className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Total Students</p>
                                    <p className="font-bold text-lg">{enrollments.length}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                  <div className="rounded-full bg-green-100 p-3 mr-3">
                                    <FiCheckCircle className="text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Avg. Progress</p>
                                    <p className="font-bold text-lg">
                                      {enrollments.length > 0 ? 
                                        Math.round(
                                          enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length
                                        ) : 0}%
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded shadow-sm flex items-center">
                                  <div className="rounded-full bg-purple-100 p-3 mr-3">
                                    <FiFile className="text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Completed Tasks</p>
                                    <p className="font-bold text-lg">
                                      {enrollments.reduce((sum, e) => sum + (e.completedTasks?.length || 0), 0)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Student enrollment table */}
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Tasks</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {enrollments.map(enrollment => (
                                      <tr key={enrollment._id}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="ml-2">
                                              <div className="text-sm font-medium text-gray-900">
                                                {enrollment.userId?.name || 'Unknown User'}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                {enrollment.userId?.email || 'No email'}
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                          {enrollment.enrolledAt 
                                            ? formatDate(enrollment.enrolledAt) 
                                            : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                              <div 
                                                className="bg-blue-600 h-2.5 rounded-full" 
                                                style={{ width: `${enrollment.progress || 0}%` }}>
                                              </div>
                                            </div>
                                            <span className="ml-2 text-xs">{enrollment.progress || 0}%</span>
                                          </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                          {enrollment.completedTasks?.length || 0}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                          <a 
                                            href={`/admin/submissions?batchId=${batch._id}&userId=${enrollment.userId?._id}`}
                                            className="text-blue-600 hover:text-blue-800"
                                          >
                                            View Submissions
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-4">
                              <FiInfo className="text-gray-400 mr-2" />
                              <p className="text-gray-500">No enrollments found for this batch</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSubmissionStore } from '@/store/submissionStore';
import { formatSubmissionDate, getSubmissionStatusLabel } from '@/lib/submissionUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiSearch, FiFilter, FiExternalLink, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

export default function SubmissionsPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const { submissions, fetchUserSubmissions, isLoading, error } = useSubmissionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Fetch submissions on page load
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
      
      if (user?._id) {
        await fetchUserSubmissions({ userId: user._id });
      }
    };
    
    fetchData();
  }, [isLoggedIn, user, router, fetchUserSubmissions]);
  
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
  
  // Filter submissions based on search term and filter
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      (submission.taskId?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.content || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filter === 'all') return matchesSearch;
    if (filter === 'pending') return matchesSearch && submission.status === 'pending';
    if (filter === 'reviewed') return matchesSearch && submission.status === 'reviewed';
    if (filter === 'approved') return matchesSearch && submission.status === 'approved';
    if (filter === 'rejected') return matchesSearch && submission.status === 'rejected';
    
    return matchesSearch;
  });
  
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Submissions</h1>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search submissions..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex-shrink-0">
            <div className="relative inline-block text-left w-full md:w-auto">
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Submissions</option>
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Needs Revision</option>
                </select>
              </div>
            </div>
          </div>
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
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* No submissions */}
        {!isLoading && !error && filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No submissions found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all'
                ? "No submissions match your search criteria."
                : "You haven't submitted any tasks yet."}
            </p>
            <Link 
              href="/courses" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Courses
            </Link>
          </div>
        )}
        
        {/* Submissions list */}
        {!isLoading && !error && filteredSubmissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <li key={submission._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/submissions/${submission._id}`}
                        className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {submission.taskId?.title || 'Unknown Task'}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted on {formatSubmissionDate(submission.submittedAt)}
                      </p>
                      {submission.content && (
                        <p className="text-gray-700 mt-2 truncate">
                          {submission.content.length > 150 
                            ? `${submission.content.substring(0, 150)}...` 
                            : submission.content}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        {getSubmissionStatusLabel(submission.status)}
                      </span>
                      
                      {submission.grade !== null && submission.grade !== undefined && (
                        <span className="text-sm font-medium text-gray-700 mt-2">
                          Grade: {submission.grade}/100
                        </span>
                      )}
                      
                      <Link 
                        href={`/submissions/${submission._id}`}
                        className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Details
                        <FiExternalLink className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 
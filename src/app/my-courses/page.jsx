'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiUsers, FiSearch, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import Footer from '@/components/Footer';

export default function MyCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  
  // Batch state from Zustand
  const { 
    batches, 
    enrollments, 
    isLoading, 
    fetchBatches, 
    fetchEnrollments, 
    isEnrolled 
  } = useBatchStore();
  
  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn) {
      toast.error('Please log in to view your courses');
      router.push('/login');
      return;
    }
    
    const loadData = async () => {
      // Load user's enrollments
      await fetchEnrollments(user._id);
      
      // Load all batches
      await fetchBatches();
    };
    
    loadData();
  }, [isLoggedIn, user, router, fetchEnrollments, fetchBatches]);
  
  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get progress for a batch
  const getProgress = (batchId) => {
    const enrollment = enrollments.find(e => e.batchId?._id === batchId);
    return enrollment ? enrollment.progress : 0;
  };
  
  // Filter enrolled batches based on search term and filter
  const filteredEnrollments = enrollments.filter(enrollment => {
    const batch = batches.find(b => b._id === enrollment.batchId?._id);
    
    if (!batch) return false;
    
    const matchesSearch = 
      batch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'in-progress') return matchesSearch && enrollment.progress < 100;
    if (selectedFilter === 'completed') return matchesSearch && enrollment.progress === 100;
    
    return matchesSearch;
  });
  
  // Find batch details for an enrollment
  const getBatchDetails = (enrollment) => {
    return batches.find(b => b._id === enrollment.batchId?._id) || enrollment.batchId;
  };
  
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-lg text-gray-600">Track your progress and continue learning</p>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search your courses"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg ${selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${selectedFilter === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedFilter('in-progress')}
              >
                In Progress
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${selectedFilter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
        
        {/* Enrolled Courses */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <FiAlertCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h2>
            {enrollments.length === 0 ? (
              <>
                <p className="text-gray-500 mb-6">You haven't enrolled in any courses yet.</p>
                <Link 
                  href="/courses" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </>
            ) : (
              <p className="text-gray-500">No courses match your search criteria.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEnrollments.map(enrollment => {
              const batch = getBatchDetails(enrollment);
              
              return (
                <div 
                  key={enrollment._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-40 flex-shrink-0">
                      <Image
                        src={batch.bannerImage}
                        alt={batch.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="p-6 flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{batch.title}</h2>
                      <p className="text-sm text-gray-500 mb-4">{batch.courseName}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiUsers className="mr-1" />
                          <span>{batch.instructor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiCalendar className="mr-1" />
                          <span>{formatDate(batch.startDate)}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${enrollment.progress === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/learning/${batch._id}`} 
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                      >
                        <FiBookOpen className="mr-2" />
                        <span>{enrollment.progress === 100 ? 'Review Course' : 'Continue Learning'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 
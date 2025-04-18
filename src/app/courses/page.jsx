'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiUsers, FiClock, FiSearch, FiFilter, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { fetchBatches, checkEnrollment, fetchUserEnrollments } from '@/lib/fetchUtils';
import Footer from '@/components/Footer';
import CourseGridSkeleton from '@/components/Loading/Course';
export default function CoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [batches, setBatches] = useState([]);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all batches
        const fetchedBatches = await fetchBatches();
        setBatches(fetchedBatches);
        
        // Log for debugging
        console.log(`Fetched ${fetchedBatches?.length || 0} batches`);
        
        if (fetchedBatches?.length === 0) {
          toast.info('No courses are currently available');
        }
        
        // If user is logged in, check enrollments
        if (isLoggedIn && user?._id) {
          const enrollments = await fetchUserEnrollments(user._id);
          setUserEnrollments(enrollments);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isLoggedIn, user]);
  
  // Check if user is enrolled in a batch
  const isEnrolled = (batchId) => {
    if (!isLoggedIn || !userEnrollments.length) return false;
    
    return userEnrollments.some(enrollment => {
      const enrollmentBatchId = enrollment.batchId?._id || enrollment.batchId;
      return enrollmentBatchId === batchId;
    });
  };
  
  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter batches based on search term and filter
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filter === 'all') return matchesSearch;
    if (filter === 'enrolled' && isLoggedIn) return matchesSearch && isEnrolled(batch._id);
    if (filter === 'not-enrolled' && isLoggedIn) return matchesSearch && !isEnrolled(batch._id);
    
    return matchesSearch;
  });
  
  // Console logs to help debugging filteredBatches
  console.log('Batches in state:', batches.length);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
       
      
        {/* Course List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <CourseGridSkeleton />
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your search or filter options.</p>
          </div>
        ) : (
         
         <div>
           <div>
           <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Browse our selection of professional courses designed to help you advance your career and gain valuable skills.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses by name, instructor, or keywords"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="min-w-[200px]">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {isLoggedIn && (
                    <>
                      <option value="enrolled">My Courses</option>
                      <option value="not-enrolled">Not Enrolled</option>
                    </>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBatches.map(batch => (
              <div 
                key={batch._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={batch.bannerImage}
                    alt={batch.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h2 className="text-xl font-bold line-clamp-2">{batch.title}</h2>
                    <p className="text-sm opacity-90">{batch.courseName}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-1" />
                      <span>{formatDate(batch.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      <span>{batch.durationDays} days</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                        <FiUsers />
                      </div>
                      <p className="text-gray-700">{batch.instructor}</p>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {batch.description}
                    </p>
                  </div>
                  
                  {isLoggedIn && isEnrolled(batch._id) ? (
                    <Link 
                      href={`/batch/${batch._id}`} 
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                    >
                      <span>Continue Learning</span>
                      <FiArrowRight className="ml-2" />
                    </Link>
                  ) : (
                    <Link 
                      href={`/batch/${batch._id}`} 
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                    >
                      <span>View Details</span>
                      <FiArrowRight className="ml-2" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
        </div>
         </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 
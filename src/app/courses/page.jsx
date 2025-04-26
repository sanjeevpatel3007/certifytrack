'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiUsers, FiClock, FiSearch, FiFilter, FiArrowRight, FiBookOpen, FiAward, FiTag } from 'react-icons/fi';
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
          try {
            const enrollments = await fetchUserEnrollments(user._id);
            setUserEnrollments(enrollments);
          } catch (enrollError) {
            console.error('Error fetching enrollments:', enrollError);
            // Don't show error toast here - we still have courses to display
          }
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M40.8,-70.3C52.6,-64.5,61.9,-52.8,67.1,-39.9C72.3,-27,73.3,-13.5,72.8,-0.3C72.2,12.9,70.1,25.9,63.4,36.1C56.7,46.4,45.5,54,33.3,60.9C21.1,67.8,7.9,74.1,-5.4,74.3C-18.7,74.5,-37.4,68.7,-49.1,57.7C-60.8,46.8,-65.5,30.8,-70.9,14.9C-76.4,-1,-82.6,-16.8,-79.8,-31.1C-77,-45.4,-65.2,-58.2,-51.1,-62.8C-37,-67.5,-20.7,-64.1,-4.8,-56.7C11.1,-49.4,29,-76.1,40.8,-70.3Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="relative z-10 py-12 px-8 md:px-16 text-white">
            <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm mb-4">
              <FiBookOpen className="inline-block mr-1" /> Expand Your Knowledge
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Your Next <span className="text-yellow-300">Learning</span> Opportunity
          </h1>
            <p className="text-lg md:text-xl max-w-2xl opacity-90 mb-6">
            Browse our selection of professional courses designed to help you advance your career and gain valuable skills.
          </p>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-white text-indigo-700 hover:bg-yellow-300 transition-colors duration-300 font-medium rounded-lg px-6 py-3 flex items-center"
                onClick={() => {
                  document.getElementById('course-grid').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FiAward className="mr-2" /> View All Courses
              </button>
              {isLoggedIn && (
                <button 
                  className="bg-transparent hover:bg-white/20 border border-white/50 backdrop-blur-sm transition-colors duration-300 font-medium rounded-lg px-6 py-3 flex items-center"
                  onClick={() => setFilter('enrolled')}
                >
                  <FiBookOpen className="mr-2" /> My Enrolled Courses
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform -mt-6 md:-mt-10 relative z-20">
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

        {/* Course List */}
        <div id="course-grid">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gray-200"></div>
                  
                  <div className="p-5">
                    {/* Metadata placeholders */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                    
                    {/* Title placeholder */}
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                    
                    {/* Description placeholders */}
                    <div className="space-y-2 mb-4">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                    </div>
                    
                    {/* Button placeholder */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBatches.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FiSearch className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any courses matching your criteria. Try adjusting your search or filter options.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {filter !== 'all' && (
                <div className="flex items-center gap-2 mb-6 text-lg text-gray-700">
                  <FiTag className="text-blue-600" />
                  <span className="font-medium">
                    {filter === 'enrolled' ? 'My Enrolled Courses' : 'Available Courses'}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">
                    ({filteredBatches.length} {filteredBatches.length === 1 ? 'course' : 'courses'})
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBatches.map(batch => (
                  <div 
                    key={batch._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={batch.bannerImage}
                        alt={batch.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      {isLoggedIn && isEnrolled(batch._id) && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                          Enrolled
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h2 className="text-xl font-bold line-clamp-2">{batch.title}</h2>
                        <p className="text-sm opacity-90">{batch.courseName}</p>
                      </div>
                    </div>
                  
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="mr-1 text-blue-500" />
                          <span>{formatDate(batch.startDate)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiClock className="mr-1 text-blue-500" />
                          <span>{batch.durationDays} days</span>
                        </div>
                      </div>
                    
                      <div className="mb-5">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                            <FiUsers />
                          </div>
                          <p className="text-gray-700 font-medium">{batch.instructor}</p>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {batch.description}
                        </p>
                      </div>
                      
                      {isLoggedIn && isEnrolled(batch._id) ? (
                        <Link 
                          href={`/batch/${batch._id}`} 
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-colors"
                        >
                          <span>Continue Learning</span>
                          <FiArrowRight className="ml-2" />
                        </Link>
                      ) : (
                        <Link 
                          href={`/batch/${batch._id}`} 
                          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
                        >
                          <span>View Details</span>
                          <FiArrowRight className="ml-2" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
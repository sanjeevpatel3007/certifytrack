'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiCheckCircle, 
  FiAlertCircle,
  FiArrowRight,
  FiBookOpen
} from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import { formatDate, calculateEndDate } from '@/lib/fetchUtils';

export default function BatchDetailPage({ params }) {
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('Not Enrolled');
  
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  
  // Batch state from Zustand
  const { 
    currentBatch: batch, 
    isLoading, 
    error,
    fetchBatchById,
    checkUserEnrollment,
    enrollUserInBatch
  } = useBatchStore();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batch details
        const batchData = await fetchBatchById(params.id);
        
        if (!batchData) {
          router.push('/404');
          return;
        }
        
        // If user is logged in, check if enrolled
        if (isLoggedIn && user?._id) {
          console.log('Checking enrollment for user:', user._id, 'in batch:', params.id);
          
          const enrollmentData = await checkUserEnrollment(params.id, user._id);
          console.log('Enrollment data received:', enrollmentData);
          
          setIsEnrolled(enrollmentData.isEnrolled);
          setEnrollment(enrollmentData.enrollment);
          setEnrollmentStatus(enrollmentData.isEnrolled ? 'Enrolled' : 'Not Enrolled');
          
          if (enrollmentData.isEnrolled) {
            console.log('User is enrolled in this batch');
          } else {
            console.log('User is not enrolled in this batch');
          }
        }
      } catch (error) {
        console.error('Error fetching batch details:', error);
        toast.error('Failed to load course details');
      }
    };
    
    fetchData();
    
    // Cleanup on unmount
    return () => {
      // Clear current batch data when leaving page
      useBatchStore.getState().clearBatchData();
    };
  }, [params.id, user, isLoggedIn, router, fetchBatchById, checkUserEnrollment]);
  
  // Handle enrollment
  const handleEnroll = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to enroll in this course');
      router.push('/login');
      return;
    }
    
    try {
      const result = await enrollUserInBatch(params.id, user._id);
      
      if (result) {
        setIsEnrolled(true);
        setEnrollment(result.enrollment);
        setEnrollmentStatus('Enrolled');
        toast.success('Successfully enrolled!');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(error.message || 'Failed to enroll in the course');
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Course</h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <Link 
              href="/courses" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  // Render 404 if batch not found
  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/courses" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  // Calculate end date based on start date and duration
  const endDate = calculateEndDate(batch.startDate, batch.durationDays / 7);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative h-80 rounded-xl overflow-hidden mb-8">
          <Image
            src={batch.bannerImage}
            alt={batch.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-4xl font-bold text-white">{batch.title}</h1>
              {isLoggedIn && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isEnrolled ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {enrollmentStatus}
                </span>
              )}
            </div>
            <p className="text-xl text-white mb-4">{batch.courseName}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-white">
                <FiCalendar className="mr-2" />
                <span>Start Date: {formatDate(batch.startDate)}</span>
              </div>
              <div className="flex items-center text-white">
                <FiClock className="mr-2" />
                <span>Duration: {batch.durationDays} days</span>
              </div>
              <div className="flex items-center text-white">
                <FiUsers className="mr-2" />
                <span>Instructor: {batch.instructor}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
              <p className="text-gray-700 mb-8">{batch.description}</p>
              
              {/* What You'll Learn */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {batch.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              
              {/* Prerequisites */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">Prerequisites</h3>
              <div className="mb-8">
                {batch.prerequisites.length > 0 ? (
                  <div className="space-y-2">
                    {batch.prerequisites.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <FiAlertCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No prerequisites required for this course.</p>
                )}
              </div>
              
              {/* Benefits */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">Benefits</h3>
              <div className="space-y-2">
                {batch.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Course Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Timeline</h2>
              <div className="relative border-l-2 border-blue-500 ml-4 pl-8 pb-8">
                <div className="mb-8">
                  <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-500"></div>
                  <div className="mb-2">
                    <span className="font-bold text-gray-800">Day 1</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-600">{formatDate(batch.startDate)}</span>
                  </div>
                  <p className="text-gray-700">Course introduction and setup</p>
                </div>
                
                <div className="mb-8">
                  <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-500"></div>
                  <div className="mb-2">
                    <span className="font-bold text-gray-800">Middle Days</span>
                  </div>
                  <p className="text-gray-700">Core course content, assignments, and projects</p>
                </div>
                
                <div>
                  <div className="absolute -left-2.5 mt-1.5 h-5 w-5 rounded-full border-4 border-white bg-blue-500"></div>
                  <div className="mb-2">
                    <span className="font-bold text-gray-800">Day {batch.durationDays}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-600">{endDate}</span>
                  </div>
                  <p className="text-gray-700">Course completion and certification</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex justify-between mb-4">
                  <div className="text-gray-500">Price</div>
                  <div className="text-2xl font-bold">
                    {batch.price > 0 ? `$${batch.price.toFixed(2)}` : 'Free'}
                  </div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div className="text-gray-500">Duration</div>
                  <div>{batch.durationDays} days</div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div className="text-gray-500">Start Date</div>
                  <div>{formatDate(batch.startDate)}</div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <div className="text-gray-500">End Date</div>
                  <div>{endDate}</div>
                </div>
              </div>
              
              {isEnrolled ? (
                <Link
                  href={`/learning/${params.id}`}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  <FiBookOpen className="mr-2" />
                  <span>Continue Learning</span>
                </Link>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <span>Enroll Now</span>
                  <FiArrowRight className="ml-2" />
                </button>
              )}
              
              {isEnrolled && (
                <div className="mt-4">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-gray-500">Your Progress</span>
                    <span className="text-sm font-medium">{enrollment?.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${enrollment?.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md text-sm text-gray-600">
                  <FiUsers className="mr-2" />
                  <span>Instructor: {batch.instructor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
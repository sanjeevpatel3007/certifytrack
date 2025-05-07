'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiBook, FiAward, FiBriefcase, FiCheck, FiClock, FiBookOpen } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProfileSkeleton from '@/components/Loading/Profile-skelton';

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalCertificates: 0
  });
  
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  
  // Batch state from Zustand
  const { enrollments, fetchEnrollments, isLoading } = useBatchStore();
  
  // Load user data and enrollments
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to view your profile');
      router.push('/login');
      return;
    }
    
    const loadData = async () => {
      if (user?._id) {
        // Load user's enrollments
        await fetchEnrollments(user._id);
      }
    };
    
    loadData();
  }, [isLoggedIn, user, router, fetchEnrollments]);
  
  // Update stats when enrollments change
  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      const completed = enrollments.filter(e => e.progress === 100).length;
      
      setStats({
        totalCourses: enrollments.length,
        completedCourses: completed,
        inProgressCourses: enrollments.length - completed,
        totalCertificates: completed // Assuming each completed course has a certificate
      });
    }
  }, [enrollments]);
  
  if (!isLoggedIn || !user) {
    return null; // Will redirect in useEffect
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
       
        <ProfileSkeleton />
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
     
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-md">
                  <Image 
                    src={user.profilePicture || '/images/default-avatar.png'} 
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-auto">
                  <Link 
                    href="/profile/edit" 
                    className="px-4 py-2 flex items-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiEdit className="mr-2" />
                    <span>Edit Profile</span>
                  </Link>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-full bg-blue-100 text-blue-600">
                    <FiBook />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-full bg-green-100 text-green-600">
                    <FiCheck />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.completedCourses}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-full bg-yellow-100 text-yellow-600">
                    <FiClock />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.inProgressCourses}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-full bg-purple-100 text-purple-600">
                    <FiAward />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</div>
                  <div className="text-sm text-gray-600">Certificates</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <FiUser />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="font-medium">{user.name}</div>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <FiMail />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email Address</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center border-b border-gray-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <FiPhone />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone Number</div>
                  <div className="font-medium">{user.phone || 'Not provided'}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <FiMapPin />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{user.location || 'Not provided'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Current Courses */}
          {enrollments && enrollments.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Current Courses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.map((enrollment) => (
                  <div 
                    key={enrollment._id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {enrollment.batchId?.title || 'Course Title'}
                      </h3>
                      <div className="mb-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-xs font-medium">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <Link 
                        href={`/learning/${enrollment.batchId?._id || enrollment.batchId}`}
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center"
                      >
                        <FiBookOpen className="mr-1" />
                        <span>Continue Learning</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/my-courses" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <FiBook />
                </div>
                <div>
                  <div className="font-medium">My Courses</div>
                  <div className="text-sm text-gray-500">View all your enrolled courses</div>
                </div>
              </Link>
              
              <Link 
                href="/my-certificates" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                  <FiAward />
                </div>
                <div>
                  <div className="font-medium">My Certificates</div>
                  <div className="text-sm text-gray-500">Access your earned certificates</div>
                </div>
              </Link>
              
              <Link 
                href="/courses" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                  <FiBriefcase />
                </div>
                <div>
                  <div className="font-medium">Browse Courses</div>
                  <div className="text-sm text-gray-500">Discover new learning opportunities</div>
                </div>
              </Link>
              
              <Link 
                href="/profile/edit" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-4">
                  <FiEdit />
                </div>
                <div>
                  <div className="font-medium">Edit Profile</div>
                  <div className="text-sm text-gray-500">Update your personal information</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
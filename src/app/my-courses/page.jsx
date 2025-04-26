'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiBook, FiCheck, FiClock } from 'react-icons/fi';

import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';

import CourseSkeleton from '@/components/Loading/Course';

export default function MyCoursesPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
  });

  const { user, isLoggedIn } = useAuthStore();
  const { enrollments, fetchEnrollments, isLoading } = useBatchStore();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Please log in to view your courses');
      router.push('/login');
      return;
    }

    const loadData = async () => {
      if (user?._id) {
        await fetchEnrollments(user._id);
      }
    };

    loadData();
  }, [isLoggedIn, user, router, fetchEnrollments]);

  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      const completed = enrollments.filter(e => e.progress === 100).length;

      setStats({
        totalCourses: enrollments.length,
        completedCourses: completed,
        inProgressCourses: enrollments.length - completed,
      });
    }
  }, [enrollments]);

  if (!isLoggedIn || !user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CourseSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-8">
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600">Here are all your enrolled courses and their progress.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<FiBook />} value={stats.totalCourses} label="Total Courses" color="blue" />
            <StatCard icon={<FiCheck />} value={stats.completedCourses} label="Completed" color="green" />
            <StatCard icon={<FiClock />} value={stats.inProgressCourses} label="In Progress" color="yellow" />
          </div>

          {enrollments && enrollments.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Courses</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.map((enrollment) => (
                  <CourseCard key={enrollment._id} enrollment={enrollment} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-600">You have not enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      </main>

     
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg text-center`}>
      <div className={`flex items-center justify-center h-10 w-10 mx-auto mb-2 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function CourseCard({ enrollment }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
          <FiBook className="mr-1" />
          <span>Continue Learning</span>
        </Link>
      </div>
    </div>
  );
}

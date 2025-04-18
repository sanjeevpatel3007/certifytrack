'use client';

import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Profile Avatar */}
          <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse mb-4"></div>

          {/* Profile Name and Info */}
          <div className="w-48 h-6 bg-gray-300 animate-pulse rounded mb-2"></div>
          <div className="w-64 h-4 bg-gray-300 animate-pulse rounded mb-6"></div>

          {/* Stats (Courses, Certificates) */}
          <div className="flex space-x-6 mb-8">
            <div className="w-24 h-8 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-24 h-8 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-24 h-8 bg-gray-300 animate-pulse rounded"></div>
          </div>

          {/* Enrollments Section */}
          <div className="w-full h-6 bg-gray-300 animate-pulse rounded mb-4"></div>
          <div className="w-full h-4 bg-gray-300 animate-pulse rounded mb-2"></div>
        </div>
      </main>
    </div>
  );
};


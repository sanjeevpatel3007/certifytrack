'use client';

import { CourseSkeleton } from '@/components/loaders/Skeleton';

export default function CoursesLoading() {
  return (
    <div className="container-custom py-16">
      <div className="mb-12">
        <div className="h-8 w-60 bg-gray-200 rounded-md mb-4 skeleton-pulse"></div>
        <div className="h-4 w-96 bg-gray-200 rounded-md skeleton-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    </div>
  );
} 
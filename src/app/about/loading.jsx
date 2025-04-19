'use client';

import { HeroSkeleton } from '@/components/loaders/Skeleton';

export default function AboutLoading() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      
      <div className="container-custom py-16">
        {/* Story section skeleton */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded-full mb-4 skeleton-pulse"></div>
            <div className="h-8 w-72 bg-gray-200 rounded-md mb-4 skeleton-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded-md skeleton-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md skeleton-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded-md skeleton-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded-md skeleton-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded-md skeleton-pulse"></div>
            </div>
          </div>
          
          <div className="h-80 bg-gray-200 rounded-2xl skeleton-pulse"></div>
        </div>
        
        {/* Values section skeleton */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded-full mx-auto mb-4 skeleton-pulse"></div>
            <div className="h-8 w-64 bg-gray-200 rounded-md mx-auto mb-4 skeleton-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-md mx-auto skeleton-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-48 bg-gray-200 rounded-2xl skeleton-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
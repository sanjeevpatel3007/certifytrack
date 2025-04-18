import React from "react";
import CourseCardSkeleton from "./Course-card";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse mt-40">
      <div className="col-span-full">
        {/* Header Skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-8 w-1/3 bg-gray-300 rounded" />
          <div className="h-6 w-2/3 bg-gray-200 rounded" />
        </div>

        {/* Search and Filter Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-300" />
              </div>
              <div className="w-full pl-10 pr-4 py-3 bg-gray-200 rounded-lg" />
            </div>

            {/* Filter Dropdown */}
            <div className="min-w-[200px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-300" />
              </div>
              <div className="w-full pl-10 pr-4 py-3 bg-gray-200 rounded-lg" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards Skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

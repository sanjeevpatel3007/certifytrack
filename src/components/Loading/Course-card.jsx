import React from "react";

export default function CourseCardSkeleton() {
  return (
    <div className="w-full md:w-[400px] h-[300px] bg-white rounded-xl border shadow animate-pulse flex flex-col overflow-hidden">
      {/* Image placeholder */}
      <div className="h-40 bg-gray-200 w-full" />

      <div className="flex-1 p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        {/* Subtitle */}
        <div className="h-3 bg-gray-300 rounded w-1/2" />
        
        {/* Date & Duration */}
        <div className="flex items-center gap-4 mt-3">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-12 bg-gray-200 rounded" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
          <div className="h-3 w-1/2 bg-gray-300 rounded" />
        </div>

        {/* Description */}
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-[80%] bg-gray-200 rounded" />

        {/* Button */}
        <div className="mt-6 h-10 bg-gray-300 rounded-md w-full" />
      </div>
    </div>
  );
}

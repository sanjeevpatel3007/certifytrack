'use client';

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="h-8 w-48 bg-gray-200 rounded-md mx-auto mb-4 skeleton-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-md mx-auto skeleton-pulse"></div>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-md rounded-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded-md skeleton-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md skeleton-pulse"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded-md skeleton-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md skeleton-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded-sm mr-2 skeleton-pulse"></div>
                <div className="h-4 w-28 bg-gray-200 rounded-md skeleton-pulse"></div>
              </div>
              <div className="h-4 w-36 bg-gray-200 rounded-md skeleton-pulse"></div>
            </div>
            
            <div className="h-12 w-full bg-gray-200 rounded-md skeleton-pulse"></div>
            
            <div className="text-center mt-8">
              <div className="h-4 w-48 mx-auto bg-gray-200 rounded-md skeleton-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
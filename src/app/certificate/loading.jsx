'use client';

export default function CertificateLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section skeleton */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <div className="h-6 w-48 bg-white/10 rounded-full mb-4 skeleton-pulse"></div>
              <div className="h-10 w-64 bg-white/10 rounded-md mb-2 skeleton-pulse"></div>
              <div className="h-6 w-40 bg-white/10 rounded-md skeleton-pulse"></div>
            </div>
            
            <div className="mt-6 md:mt-0 flex gap-3">
              <div className="h-10 w-24 bg-white/10 rounded-lg skeleton-pulse"></div>
              <div className="h-10 w-36 bg-white/10 rounded-lg skeleton-pulse"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Certificate Preview skeleton */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden relative p-8 md:p-12">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                  <div className="h-16 w-48 bg-gray-200 rounded skeleton-pulse"></div>
                  <div className="text-right">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-1 skeleton-pulse"></div>
                    <div className="h-5 w-28 bg-gray-200 rounded skeleton-pulse"></div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <div className="h-8 w-64 bg-gray-200 rounded-md mx-auto mb-3 skeleton-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-4 skeleton-pulse"></div>
                  <div className="h-10 w-48 bg-gray-200 rounded-md mx-auto mb-4 skeleton-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-4 skeleton-pulse"></div>
                  <div className="h-8 w-64 bg-gray-200 rounded-md mx-auto mb-2 skeleton-pulse"></div>
                  <div className="h-6 w-40 bg-gray-200 rounded mx-auto skeleton-pulse"></div>
                </div>
                
                <div className="h-16 w-full bg-gray-200 rounded-md mx-auto mb-10 skeleton-pulse"></div>
                
                <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b border-slate-100">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center mb-4 md:mb-0">
                      <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-2 skeleton-pulse"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded mx-auto skeleton-pulse"></div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <div className="h-20 w-28 bg-gray-200 rounded skeleton-pulse"></div>
                  <div className="h-16 w-32 bg-gray-200 rounded skeleton-pulse"></div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-7 w-40 bg-gray-200 rounded mb-6 skeleton-pulse"></div>
                
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 mr-3 skeleton-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-gray-200 rounded mb-2 skeleton-pulse"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded skeleton-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <div className="h-6 w-20 bg-gray-200 rounded mb-3 skeleton-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-6 w-20 bg-gray-200 rounded-full skeleton-pulse"></div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 skeleton-pulse"></div>
                    <div className="h-5 w-36 bg-gray-200 rounded skeleton-pulse"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg mt-4 skeleton-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* More Certificates skeleton */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6 skeleton-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                <div className="h-2 bg-gray-200 skeleton-pulse"></div>
                <div className="h-6 w-48 bg-gray-200 rounded mt-4 mb-2 skeleton-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-4 skeleton-pulse"></div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded skeleton-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded skeleton-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
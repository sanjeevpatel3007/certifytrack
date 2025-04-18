import Navbar from "../Navbar";
import Footer from "../Footer";

export default function LearningPageLoadingSkeleton() {
    return (
      <div className="p-4 md:p-8 animate-pulse space-y-6">
        {/* Header Image */}
        <div className="w-full h-48 md:h-64 bg-gray-300 rounded-lg" />
  
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
  
            {/* Metadata Row */}
            <div className="flex gap-4 mt-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
  
            {/* Sections */}
            <div className="mt-6 space-y-4">
              {/* Section Title */}
              <div className="h-5 bg-gray-300 w-40 rounded" />
  
              {/* Bullet points */}
              <div className="space-y-2">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="h-4 bg-gray-200 rounded w-3/4" />
                ))}
              </div>
            </div>
          </div>
  
          {/* Right Column (Sidebar) */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="h-6 bg-gray-300 w-24 rounded" />
            <div className="h-4 bg-gray-200 w-20 rounded" />
            <div className="h-4 bg-gray-200 w-32 rounded" />
            <div className="h-4 bg-gray-200 w-32 rounded" />
  
            <div className="h-10 bg-gray-300 rounded" />
  
            <div className="h-4 bg-gray-200 w-1/2 rounded" />
            <div className="h-8 bg-gray-200 w-full rounded" />
          </div>
        </div>
      </div>
    );
  };
  
export function Skeleton({ className, height, width, rounded }) {
  return (
    <div 
      className={`bg-gray-200 animate-pulse ${rounded ? `rounded-${rounded}` : 'rounded'} ${className || ''}`}
      style={{ 
        height: height || '1rem', 
        width: width || '100%' 
      }}
    ></div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="w-1/2 h-5 bg-gray-200 rounded mb-4"></div>
      <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
      <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
      <div className="w-3/4 h-3 bg-gray-200 rounded mb-4"></div>
      <div className="w-1/3 h-8 bg-gray-200 rounded-md"></div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
        <div className="w-24 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <div className="flex items-center space-x-4 py-4 animate-pulse">
      {[...Array(cols)].map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${Math.floor(100 / cols)}%` }}
        ></div>
      ))}
    </div>
  );
}

export function CourseSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="w-2/3 h-5 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
          <div className="w-10 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="container-custom section-padding animate-pulse">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="w-full md:w-3/4 h-10 bg-gray-200 rounded mx-auto"></div>
        <div className="w-full md:w-2/3 h-4 bg-gray-200 rounded mx-auto"></div>
        <div className="w-full md:w-2/3 h-4 bg-gray-200 rounded mx-auto"></div>
        <div className="flex justify-center space-x-4">
          <div className="w-32 h-10 bg-gray-200 rounded"></div>
          <div className="w-32 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton; 
'use client';

import { FiAward, FiLock } from 'react-icons/fi';

export default function CertificateIcon({ 
  isUnlocked = false, 
  size = 'md', 
  className = '',
  showLock = true
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };
  
  const containerSizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
    xl: 'h-14 w-14'
  };
  
  const iconSize = sizeClasses[size] || sizeClasses.md;
  const containerSize = containerSizeClasses[size] || containerSizeClasses.md;
  
  return (
    <div className={`relative inline-flex ${className}`}>
      <div 
        className={`${containerSize} rounded-full flex items-center justify-center ${
          isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}
      >
        <FiAward className={iconSize} />
      </div>
      
      {showLock && !isUnlocked && (
        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center border border-white">
          <FiLock className="w-3 h-3 text-gray-500" />
        </div>
      )}
    </div>
  );
} 
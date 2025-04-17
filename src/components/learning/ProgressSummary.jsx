'use client';

import { FiAward, FiBarChart2, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatDate } from '@/lib/fetchUtils';

export default function ProgressSummary({ 
  batch,
  progress,
  completedTasksCount,
  totalTasksCount
}) {
  // Calculate time data
  const startDate = new Date(batch?.startDate);
  const today = new Date();
  const totalDays = batch?.durationDays || 30;
  
  // Calculate days elapsed
  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const daysElapsedPercentage = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));
  
  // Format for display
  const startDateFormatted = formatDate(batch?.startDate);
  const endDateFormatted = formatDate(new Date(startDate.getTime() + (totalDays * 24 * 60 * 60 * 1000)));
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Course Progress</h2>
      </div>
      
      <div className="p-6">
        {/* Overall progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FiBarChart2 />
              </div>
              <div>
                <div className="text-sm text-gray-500">Tasks Completed</div>
                <div className="text-xl font-bold text-gray-900">
                  {completedTasksCount} / {totalTasksCount}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 mr-3">
                <FiCheckCircle />
              </div>
              <div>
                <div className="text-sm text-gray-500">Completion Status</div>
                <div className="text-xl font-bold text-gray-900">
                  {progress === 100 ? 'Complete' : `${progress}% Done`}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <FiClock />
              </div>
              <div>
                <div className="text-sm text-gray-500">Course Timeline</div>
                <div className="text-xl font-bold text-gray-900">
                  Day {daysElapsed + 1} of {totalDays}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FiAward />
              </div>
              <div>
                <div className="text-sm text-gray-500">Certificate</div>
                <div className="text-xl font-bold text-gray-900">
                  {progress === 100 ? 'Earned' : 'In Progress'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Course Timeline Progress</span>
            <span className="text-sm font-medium text-gray-700">{daysElapsedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-yellow-500 h-2.5 rounded-full"
              style={{ width: `${daysElapsedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{startDateFormatted}</span>
            <span>{endDateFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
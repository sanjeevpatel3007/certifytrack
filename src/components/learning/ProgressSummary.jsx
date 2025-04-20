'use client';

import { useState } from 'react';
import {
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiLock,
  FiCheck,
} from 'react-icons/fi';
import { formatDate } from '@/lib/fetchUtils';

export default function ProgressSummary({
  batch,
  progress,
  completedTasksCount,
  totalTasksCount,
  tasksByDay,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const startDate = new Date(batch?.startDate);
  const today = new Date();
  const totalDays = batch?.durationDays || 30;

  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const daysElapsedPercentage = Math.min(
    100,
    Math.max(0, Math.round((daysElapsed / totalDays) * 100))
  );

  const startDateFormatted = formatDate(batch?.startDate);
  const endDateFormatted = formatDate(
    new Date(startDate.getTime() + totalDays * 24 * 60 * 60 * 1000)
  );

  const availableTasksCount = tasksByDay
    ? tasksByDay.reduce((count, day) => {
        return count + day.tasks.filter((task) => !task.isPlaceholder).length;
      }, 0)
    : totalTasksCount;

  const comingSoonTasksCount = totalTasksCount - availableTasksCount;
  const remainingTasksCount = totalTasksCount - completedTasksCount;
  const completionRate =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;
  const tasksPerDay =
    totalDays > 0 ? (totalTasksCount / totalDays).toFixed(1) : 0;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Course Progress</h2>
        <button
          onClick={toggleExpanded}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
        >
          {isExpanded ? (
            <>
              <span className="mr-1 hidden sm:inline">Show Less</span>
              <FiChevronUp />
            </>
          ) : (
            <>
              <span className="mr-1 hidden sm:inline">Show Details</span>
              <FiChevronDown />
            </>
          )}
        </button>
      </div>

      <div className="p-4 md:p-6">
        {/* Overall progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Overall Progress
              </span>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {completedTasksCount}/{totalTasksCount} Tasks
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline - Always visible */}
        <div className="mb-4">
          {/* <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Course Timeline Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              {daysElapsedPercentage}%
            </span>
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
          </div> */}
        </div>

        {/* Expanded Data */}
        {isExpanded && (
          <>
            {/* Basic Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <FiBarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Completed</div>
                    <div className="text-sm font-bold text-gray-900">
                      {completedTasksCount} Tasks
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 mr-2">
                    <FiClock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Timeline</div>
                    <div className="text-sm font-bold text-gray-900">
                      Day {daysElapsed + 1}/{totalDays}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 mr-2">
                    <FiCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Available</div>
                    <div className="text-sm font-bold text-gray-900">
                      {availableTasksCount} Tasks
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600 mr-2">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Coming Soon</div>
                    <div className="text-sm font-bold text-gray-900">
                      {comingSoonTasksCount} Tasks
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="mt-6 border-t border-gray-100 pt-6 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Detailed Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Task Breakdown
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Tasks</span>
                      <span>{totalTasksCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="text-green-600">
                        {completedTasksCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining</span>
                      <span className="text-yellow-600">
                        {remainingTasksCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Now</span>
                      <span className="text-blue-600">
                        {availableTasksCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coming Soon</span>
                      <span className="text-purple-600">
                        {comingSoonTasksCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Course Structure
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Days</span>
                      <span>{totalDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Day</span>
                      <span>{Math.min(daysElapsed + 1, totalDays)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Days Remaining</span>
                      <span>{Math.max(0, totalDays - daysElapsed - 1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasks per Day</span>
                      <span>{tasksPerDay}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Achievement Stats
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Completion Rate</span>
                      <span>{completionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

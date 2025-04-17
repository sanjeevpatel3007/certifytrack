'use client';

import { useState } from 'react';
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiVideo,
  FiEdit,
  FiBook,
  FiCode,
  FiClipboard
} from 'react-icons/fi';
import { getTaskCompletionStatus } from '@/lib/fetchUtils';

export default function TaskSidebar({ 
  days, 
  completedTasks, 
  currentTaskId, 
  onSelectTask 
}) {
  const [expandedDays, setExpandedDays] = useState({});

  // Toggle day expansion
  const toggleDay = (dayNumber) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNumber]: !prev[dayNumber]
    }));
  };

  // Check if day is expanded
  const isDayExpanded = (dayNumber) => {
    // If expandedDays[dayNumber] is undefined or true, show as expanded
    return expandedDays[dayNumber] !== false;
  };

  // Get day progress
  const getDayProgress = (dayTasks) => {
    return getTaskCompletionStatus(dayTasks, completedTasks);
  };

  // Get appropriate icon based on content type
  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'video': 
        return <FiVideo className="mr-2 flex-shrink-0" />;
      case 'quiz': 
        return <FiClipboard className="mr-2 flex-shrink-0" />;
      case 'assignment': 
        return <FiEdit className="mr-2 flex-shrink-0" />;
      case 'reading': 
        return <FiBook className="mr-2 flex-shrink-0" />;
      case 'project': 
        return <FiCode className="mr-2 flex-shrink-0" />;
      default: 
        return <FiFileText className="mr-2 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-lg font-bold text-gray-800">Course Content</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {days.map((day) => {
          const { completedCount, totalCount, percentage } = getDayProgress(day.tasks);
          const isExpanded = isDayExpanded(day.dayNumber);
          
          return (
            <div key={day.dayNumber} className="overflow-hidden">
              {/* Day header */}
              <button 
                onClick={() => toggleDay(day.dayNumber)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <FiCalendar />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Day {day.dayNumber}</h3>
                    <p className="text-sm text-gray-500">{completedCount} of {totalCount} completed</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-500 mr-2">{percentage}%</span>
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <FiChevronDown className="text-gray-400" />
                  ) : (
                    <FiChevronRight className="text-gray-400" />
                  )}
                </div>
              </button>
              
              {/* Tasks for this day */}
              <div
                className={`
                  transition-all duration-300 space-y-1 px-4 pb-1
                  ${isExpanded ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 overflow-hidden py-0'}
                `}
              >
                {day.tasks.map((task) => {
                  const isCompleted = completedTasks.includes(task._id);
                  const isActive = currentTaskId === task._id;
                  
                  return (
                    <button
                      key={task._id}
                      onClick={() => onSelectTask(task)}
                      className={`
                        w-full flex items-center p-2 rounded-md text-left
                        ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
                        ${isCompleted ? 'text-green-600' : 'text-gray-700'}
                      `}
                    >
                      <div className="w-5 h-5 flex-shrink-0 mr-3">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                            <FiCheck className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center border border-gray-300">
                            <FiClock className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        {getContentTypeIcon(task.contentType)}
                        <span className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { FiBug, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function TaskDebugView({ task }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!task) return null;

  return (
    <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 text-left"
      >
        <div className="flex items-center">
          <FiBug className="text-gray-500 mr-2" />
          <span className="font-medium text-gray-700">Developer Debug View</span>
        </div>
        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {isExpanded && (
        <div className="p-4 overflow-x-auto bg-gray-100">
          <pre className="text-xs text-gray-700">{JSON.stringify(task, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 
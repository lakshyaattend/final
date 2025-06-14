import React from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { classSheets } from '../utils/api';

interface ClassSelectorProps {
  selectedClass: string | null;
  onClassSelect: (classId: string) => void;
  teacherName: string;
  onLogout: () => void;
}

export function ClassSelector({
  selectedClass,
  onClassSelect,
  teacherName,
  onLogout,
}: ClassSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {teacherName}</h2>
        <button
          onClick={onLogout}
          className="text-sm text-gray-600 hover:text-gray-800 underline transition duration-200"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Class for Attendance
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BookOpen className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="class-select"
            value={selectedClass || ''}
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue) {
                onClassSelect(selectedValue);
              }
            }}
            className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:outline-none focus:ring-2 transition duration-200 appearance-none bg-white"
          >
            <option value="">Select a class...</option>
            {classSheets.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700">
        <p className="text-sm">
          Please select a class to take attendance. The student list will be loaded automatically.
        </p>
      </div>
    </div>
  );
}
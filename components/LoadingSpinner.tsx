
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-24 h-24">
        <div className="absolute border-4 border-gray-700 rounded-full w-full h-full"></div>
        <div className="absolute border-4 border-t-indigo-500 border-l-indigo-500 rounded-full w-full h-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex items-center justify-center py-10 w-full">
      <div className={`animate-spin rounded-full border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size]}`}></div>
    </div>
  );
};

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-800/40 rounded-xl ${className}`}></div>
  );
};

export default LoadingSpinner;

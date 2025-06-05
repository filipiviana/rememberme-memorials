
import React from 'react';

interface MemorialLogoProps {
  className?: string;
}

const MemorialLogo = ({ className = "" }: MemorialLogoProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-primary" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L9 9l-7 0 5.5 4.5L5 22l7-5 7 5-2.5-8.5L22 9l-7 0-3-7z"/>
        </svg>
      </div>
      <span className="text-xl font-bold text-gray-800">Remember me</span>
    </div>
  );
};

export default MemorialLogo;

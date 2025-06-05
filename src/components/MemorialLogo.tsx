
import React from 'react';

const MemorialLogo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-primary" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C8.686 2 6 4.686 6 8c0 1.084.289 2.101.8 2.99L12 22l5.2-11.01c.511-.889.8-1.906.8-2.99 0-3.314-2.686-6-6-6zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
        </svg>
      </div>
      <span className="text-xl font-bold text-gray-800">Remember me</span>
    </div>
  );
};

export default MemorialLogo;

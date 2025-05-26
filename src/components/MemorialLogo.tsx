
import React from 'react';

const MemorialLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border border-primary rounded-full bg-background"></div>
      </div>
      <span className="font-bold text-xl tracking-tight">MEMORIZE</span>
    </div>
  );
};

export default MemorialLogo;

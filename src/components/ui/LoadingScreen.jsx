import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Futuristic loading spinner */}
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h2 className="mt-6 text-xl font-semibold text-primary">
          Loading Erteban Platform
        </h2>
        <p className="mt-2 text-gray-400">
          Preparing futuristic experience...
        </p>
      </div>
    </div>
  );
}
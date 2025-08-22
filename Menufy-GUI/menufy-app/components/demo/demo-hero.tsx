'use client'

import React from 'react';

export const DemoHero = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎬 Menufy Demo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore Menufy&#39;s features with our interactive demo. Choose your experience below:
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Two Ways to Experience Menufy
          </h2>
          <p className="text-blue-700">
            Try our platform from both perspectives - as a restaurant guest placing orders 
            or as a restaurant owner managing your business.
          </p>
        </div>
        
      </div>
    </div>
  );
};

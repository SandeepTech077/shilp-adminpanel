// Test component to verify image URL construction
import React from 'react';
import { getImageUrl } from '../api';

export const ImageUrlTest: React.FC = () => {
  const testPaths = [
    '/uploads/banners/homepageBanner_banner_1762681381497_20555929_1920_X_1080.jpg',
    'homepageBanner_banner_1762681381497_20555929_1920_X_1080.jpg',
    'uploads/banners/test.jpg',
    'http://example.com/test.jpg'
  ];

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Image URL Test</h3>
      {testPaths.map((path, index) => {
        const fullUrl = getImageUrl(path);
        return (
          <div key={index} className="mb-2 p-2 bg-white rounded border">
            <p><strong>Input:</strong> {path}</p>
            <p><strong>Output:</strong> {fullUrl}</p>
            <img 
              src={fullUrl} 
              alt="Test" 
              className="w-20 h-20 object-cover mt-2 border"
              onError={(e) => {
                console.error('Failed to load:', fullUrl);
                e.currentTarget.style.border = '2px solid red';
              }}
              onLoad={() => {
                console.log('Successfully loaded:', fullUrl);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageUrlTest;
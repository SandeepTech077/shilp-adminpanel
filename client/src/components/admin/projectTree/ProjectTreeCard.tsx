import React from 'react';
import type { ProjectTree } from '../../../api/projectTree';

interface ProjectTreeCardProps {
  projectTree: ProjectTree;
  onEdit: (projectTree: ProjectTree) => void;
  onDelete: (id: string, title: string) => void;
}

const ProjectTreeCard: React.FC<ProjectTreeCardProps> = ({ projectTree, onEdit, onDelete }) => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
  
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) {
      console.log('No image path provided');
      return '/placeholder-image.png';
    }
    if (imagePath.startsWith('http')) {
      console.log('Full URL:', imagePath);
      return imagePath;
    }
    // Clean the path - remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullUrl = `${IMAGE_BASE_URL}/${cleanPath}`;
    console.log('🖼️ Constructed Image URL:', fullUrl);
    console.log('📁 Original path:', imagePath);
    console.log('🌐 IMAGE_BASE_URL:', IMAGE_BASE_URL);
    return fullUrl;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'plot':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'commercial':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'residential':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plot':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 7v1a3 3 0 003 3h12a3 3 0 003-3V7M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M3 7h18" />
          </svg>
        );
      case 'commercial':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'residential':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    if (!type) return 'Unknown';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Section - Top */}
      <div className="relative h-40 bg-linear-to-br from-blue-100 to-indigo-100">
        <img
          src={getImageUrl(projectTree.image)}
          alt={projectTree.title}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error('❌ Image failed to load:', getImageUrl(projectTree.image));
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e0e7ff" width="400" height="300"/%3E%3Ctext fill="%234f46e5" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Year Badge - Overlay */}
        <div className="absolute top-3 left-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm rounded-lg shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-lg font-bold text-white">{projectTree.year}</span>
          </div>
        </div>
        {/* Number Badge - Overlay */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold rounded-md shadow-md">
            #{projectTree.no}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 min-h-14">
          {projectTree.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium truncate">{projectTree.location}</span>
        </div>

        {/* Type Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getTypeColor(projectTree.typeofproject || '')}`}>
            {getTypeIcon(projectTree.typeofproject || '')}
            {getTypeLabel(projectTree.typeofproject || '')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onEdit(projectTree)}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(projectTree._id, projectTree.title)}
            className="flex-1 px-4 py-2 bg-white hover:bg-red-50 text-red-600 font-semibold rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTreeCard;

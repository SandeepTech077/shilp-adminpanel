import React from 'react';
import { X, CheckCircle, Upload, Save, Trash2 } from 'lucide-react';

export interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: {
    section?: string;
    field?: string;
    imageUrl?: string;
    metadata?: {
      originalName?: string;
      size?: number;
      filename?: string;
    };
  };
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title,
  message,
  details,
  onClose
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    if (title.includes('Upload')) return <Upload className="w-6 h-6 text-green-600" />;
    if (title.includes('Delete')) return <Trash2 className="w-6 h-6 text-green-600" />;
    if (title.includes('Update') || title.includes('Alt')) return <Save className="w-6 h-6 text-green-600" />;
    return <CheckCircle className="w-6 h-6 text-green-600" />;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">{message}</p>

          {/* Details Section */}
          {details && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Details:</h3>
              
              {details.section && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700 font-medium">Section:</span>
                  <span className="text-sm text-green-600">{details.section}</span>
                </div>
              )}
              
              {details.field && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700 font-medium">Field:</span>
                  <span className="text-sm text-green-600">
                    {details.field === 'banner' ? 'Desktop Banner' : 'Mobile Banner'}
                  </span>
                </div>
              )}
              
              {details.imageUrl && (
                <div className="flex justify-between">
                  <span className="text-sm text-green-700 font-medium">Image:</span>
                  <span className="text-sm text-green-600 truncate max-w-48" title={details.imageUrl}>
                    {details.imageUrl}
                  </span>
                </div>
              )}
              
              {details.metadata && (
                <>
                  {details.metadata.originalName && (
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700 font-medium">Original Name:</span>
                      <span className="text-sm text-green-600 truncate max-w-48" title={details.metadata.originalName}>
                        {details.metadata.originalName}
                      </span>
                    </div>
                  )}
                  
                  {details.metadata.size && (
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700 font-medium">File Size:</span>
                      <span className="text-sm text-green-600">
                        {formatFileSize(details.metadata.size)}
                      </span>
                    </div>
                  )}
                  
                  {details.metadata.filename && (
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700 font-medium">Saved As:</span>
                      <span className="text-sm text-green-600 truncate max-w-48" title={details.metadata.filename}>
                        {details.metadata.filename}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
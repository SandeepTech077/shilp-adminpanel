// Main API exports
export { httpClient, API_CONFIG, ApiError } from './config';
export type { ApiResponse } from './config';

// Admin API
export { AdminApi } from './adminLoginApi';
export type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminVerifyTokenResponse,
  AdminProfileResponse,
} from './adminLoginApi';

// Banner API - Individual functions
export { 
  getBanners, 
  uploadBannerImage, 
  updateBannerAlt, 
  deleteBannerImage 
} from './bannerApi';
export type {
  BannerMetadata,
  BannerSection,
  BannersData,
  BannerApiResponse,
} from './bannerApi';

// Image utilities
export { getImageUrl, isImageAccessible, formatFileSize, formatUploadDate } from './imageUtils';

// Import ApiError for internal use in utilities
import { ApiError } from './config';

// API utilities
export const apiUtils = {
  /**
   * Format API error for display
   */
  formatError(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  /**
   * Check if error is network related
   */
  isNetworkError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.code === 'NETWORK_ERROR' || error.status === 0;
    }
    return false;
  },

  /**
   * Check if error is authentication related
   */
  isAuthError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.status === 401 || error.code === 'TOKEN_ERROR';
    }
    return false;
  },

  /**
   * Check if error is timeout related
   */
  isTimeoutError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.code === 'TIMEOUT';
    }
    return false;
  },
};

// Project API
export * from './projectApi';

export default {
  apiUtils,
};
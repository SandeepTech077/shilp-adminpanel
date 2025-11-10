import { httpClient, type ApiResponse } from './config';
import type { Project, ProjectForm } from '../types/project';

export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProjectStats {
  total: number;
  byState: {
    onGoing: number;
    completed: number;
  };
  byType: {
    residential: number;
    commercial: number;
    plot: number;
  };
}

// Get all projects with pagination and filtering
export const getProjects = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    state?: 'on-going' | 'completed';
    type?: 'residential' | 'commercial' | 'plot';
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }
): Promise<ApiResponse<ProjectsResponse>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(filters?.state && { state: filters.state }),
    ...(filters?.type && { type: filters.type }),
    ...(filters?.search && { search: filters.search }),
    ...(filters?.sort && { sort: filters.sort }),
    ...(filters?.order && { order: filters.order })
  });
  
  return httpClient.get<ProjectsResponse>(`/api/projects?${params}`);
};

// Get single project by ID
export const getProject = async (id: string): Promise<ApiResponse<Project>> => {
  return httpClient.get<Project>(`/api/projects/${id}`);
};

// Get project by slug
export const getProjectBySlug = async (slug: string): Promise<ApiResponse<Project>> => {
  return httpClient.get<Project>(`/api/projects/slug/${slug}`);
};

// Get projects by state
export const getProjectsByState = async (
  state: 'on-going' | 'completed',
  limit: number = 10
): Promise<ApiResponse<Project[]>> => {
  const params = new URLSearchParams({
    limit: limit.toString()
  });
  
  return httpClient.get<Project[]>(`/api/projects/state/${state}?${params}`);
};

// Get projects by type
export const getProjectsByType = async (
  type: 'residential' | 'commercial' | 'plot',
  limit: number = 10
): Promise<ApiResponse<Project[]>> => {
  const params = new URLSearchParams({
    limit: limit.toString()
  });
  
  return httpClient.get<Project[]>(`/api/projects/type/${type}?${params}`);
};

// Search projects
export const searchProjects = async (
  searchTerm: string,
  limit: number = 10
): Promise<ApiResponse<Project[]>> => {
  const params = new URLSearchParams({
    q: searchTerm,
    limit: limit.toString()
  });
  
  return httpClient.get<Project[]>(`/api/projects/search?${params}`);
};

// Get project statistics
export const getProjectStats = async (): Promise<ApiResponse<ProjectStats>> => {
  return httpClient.get<ProjectStats>('/api/projects/stats');
};

// Create new project with file uploads
export const createProject = async (formData: FormData): Promise<ApiResponse<Project>> => {
  return httpClient.request<Project>('/api/projects', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Update project with file uploads
export const updateProject = async (id: string, formData: FormData): Promise<ApiResponse<Project>> => {
  return httpClient.request<Project>(`/api/projects/${id}`, {
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete project (soft delete by default)
export const deleteProject = async (
  id: string, 
  permanent: boolean = false
): Promise<ApiResponse<{ message: string }>> => {
  const params = permanent ? '?permanent=true' : '';
  return httpClient.delete<{ message: string }>(`/api/projects/${id}${params}`);
};

// Helper function to convert ProjectForm data to FormData for API submission
export const createProjectFormData = (projectData: ProjectForm): FormData => {
  const formData = new FormData();
  
  // Basic fields
  formData.append('projectTitle', projectData.projectTitle);
  formData.append('slug', projectData.slug);
  formData.append('projectState', projectData.projectState);
  formData.append('shortAddress', projectData.shortAddress);
  formData.append('projectStatusPercentage', projectData.projectStatusPercentage.toString());
  
  // About Us descriptions
  projectData.aboutUsDescriptions.forEach((desc: { id?: string; text: string }, index: number) => {
    formData.append(`aboutUsDescriptions[${index}][id]`, desc.id || '');
    formData.append(`aboutUsDescriptions[${index}][text]`, desc.text || '');
  });
  
  formData.append('aboutUsAlt', projectData.aboutUsAlt);
  
  // Floor plans
  projectData.floorPlans.forEach((fp: { title: string; alt: string; file?: File }, index: number) => {
    formData.append(`floorPlans[${index}][title]`, fp.title);
    formData.append(`floorPlans[${index}][alt]`, fp.alt);
    if (fp.file) {
      formData.append('floorPlanImages', fp.file);
    }
  });
  
  // Project images
  projectData.projectImages.forEach((img: { alt: string; file?: File }, index: number) => {
    formData.append(`projectImages[${index}][alt]`, img.alt);
    if (img.file) {
      formData.append('projectImageFiles', img.file);
    }
  });
  
  // Amenities
  projectData.amenities.forEach((am: { title: string; alt: string; file?: File }, index: number) => {
    formData.append(`amenities[${index}][title]`, am.title);
    formData.append(`amenities[${index}][alt]`, am.alt);
    if (am.file) {
      formData.append('amenityFiles', am.file);
    }
  });
  
  // Media
  formData.append('youtubeUrl', projectData.youtubeUrl || '');
  formData.append('updatedImagesTitle', projectData.updatedImagesTitle || '');
  
  // Updated images
  projectData.updatedImages.forEach((img: { alt: string; file?: File }, index: number) => {
    formData.append(`updatedImages[${index}][alt]`, img.alt);
    if (img.file) {
      formData.append('updatedImageFiles', img.file);
    }
  });
  
  // Location section
  formData.append('locationTitle', projectData.locationTitle || '');
  formData.append('locationTitleText', projectData.locationTitleText || '');
  formData.append('locationArea', projectData.locationArea || '');
  formData.append('number1', projectData.number1 || '');
  formData.append('number2', projectData.number2 || '');
  formData.append('email1', projectData.email1 || '');
  formData.append('email2', projectData.email2 || '');
  formData.append('mapIframeUrl', projectData.mapIframeUrl || '');
  
  // Card detail
  formData.append('cardLocation', projectData.cardLocation || '');
  formData.append('cardAreaFt', projectData.cardAreaFt || '');
  formData.append('cardProjectType', projectData.cardProjectType);
  formData.append('cardHouse', projectData.cardHouse);
  
  // RERA details
  formData.append('reraNumber', projectData.reraNumber || '');
  
  // Files
  if (projectData.brochureFile) {
    formData.append('brochure', projectData.brochureFile);
  }
  
  if (projectData.aboutUsImageFile) {
    formData.append('aboutUsImage', projectData.aboutUsImageFile);
  }
  
  if (projectData.cardImageFile) {
    formData.append('cardImage', projectData.cardImageFile);
  }
  
  return formData;
};
const projectRepository = require('../repositories/projectRepository');
const fs = require('fs').promises;
const path = require('path');

class ProjectService {
  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @param {Object} files - Uploaded files
   * @returns {Promise<Object>} Created project
   */
  async createProject(projectData, files = {}) {
    let savedFiles = []; // Track saved files for cleanup
    
    try {
      // DEBUG: Log incoming projectData
      console.log('🔍 SERVICE createProject: Incoming projectData.aboutUsDetail:', JSON.stringify(projectData.aboutUsDetail, null, 2));
      
      // Check if slug already exists
      const slugExists = await projectRepository.slugExists(projectData.slug);
      if (slugExists) {
        throw new Error(`Project with slug '${projectData.slug}' already exists`);
      }

      // Process file uploads and update paths
      const processedData = await this.processFileUploads(projectData, files);
      
      // DEBUG: Log after file processing
      console.log('🔍 SERVICE createProject: After processFileUploads, aboutUsDetail:', JSON.stringify(processedData.aboutUsDetail, null, 2));
      
      // Extract saved file paths for cleanup if needed
      savedFiles = this.extractSavedFilePaths(processedData);

      // Create project
      const project = await projectRepository.create(processedData);
      
      console.log('🔍 SERVICE createProject: Created project aboutUsDetail:', JSON.stringify(project.aboutUsDetail, null, 2));
      
      return {
        success: true,
        message: 'Project created successfully',
        data: project
      };
    } catch (error) {
      // Clean up saved files if project creation fails
      await this.cleanupSavedFiles(savedFiles);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  /**
   * Get project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Project data
   */
  async getProjectById(id) {
    try {
      const project = await projectRepository.findById(id);
      
      if (!project) {
        throw new Error('Project not found');
      }

      return {
        success: true,
        data: project
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get project by slug
   * @param {string} slug - Project slug
   * @returns {Promise<Object>} Project data
   */
  async getProjectBySlug(slug) {
    try {
      const project = await projectRepository.findBySlug(slug);
      
      if (!project) {
        throw new Error('Project not found');
      }

      return {
        success: true,
        data: project
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if slug exists
   * @param {string} slug - Slug to check
   * @returns {Promise<boolean>} True if slug exists
   */
  async checkSlugExists(slug) {
    try {
      return await projectRepository.slugExists(slug);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all projects with filtering and pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Projects with pagination
   */
  async getAllProjects(options = {}) {
    try {
      const result = await projectRepository.findAll(options);
      
      return {
        success: true,
        data: result.projects,
        pagination: result.pagination
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get projects by state
   * @param {string} state - Project state
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Projects
   */
  async getProjectsByState(state, options = {}) {
    try {
      const validStates = ['on-going', 'completed'];
      if (!validStates.includes(state)) {
        throw new Error(`Invalid state. Must be one of: ${validStates.join(', ')}`);
      }

      const projects = await projectRepository.findByState(state, options);
      
      return {
        success: true,
        data: projects
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get projects by type
   * @param {string} type - Project type
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Projects
   */
  async getProjectsByType(type, options = {}) {
    try {
      const validTypes = ['residential', 'commercial', 'plot'];
      if (!validTypes.includes(type)) {
        throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }

      const projects = await projectRepository.findByType(type, options);
      
      return {
        success: true,
        data: projects
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update project
   * @param {string} id - Project ID
   * @param {Object} updateData - Update data
   * @param {Object} files - New uploaded files
   * @returns {Promise<Object>} Updated project
   */
  async updateProject(id, updateData, files = {}) {
    let newSavedFiles = []; // Track new files for cleanup
    
    try {
      const existingProject = await projectRepository.findById(id);
      if (!existingProject) {
        throw new Error('Project not found');
      }

      // Check slug uniqueness if slug is being updated
      if (updateData.slug && updateData.slug !== existingProject.slug) {
        const slugExists = await projectRepository.slugExists(updateData.slug, id);
        if (slugExists) {
          throw new Error(`Project with slug '${updateData.slug}' already exists`);
        }
      }

      // Process file uploads
      const processedData = await this.processFileUploads(updateData, files, existingProject);
      
      // Extract only new file paths (excluding existing ones)
      newSavedFiles = this.extractNewFilePaths(processedData, existingProject);

      // Update project
      const updatedProject = await projectRepository.update(id, processedData);
      
      return {
        success: true,
        message: 'Project updated successfully',
        data: updatedProject
      };
    } catch (error) {
      // Clean up new uploaded files if update fails
      await this.cleanupSavedFiles(newSavedFiles);
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  /**
   * Delete project
   * @param {string} id - Project ID
   * @param {boolean} soft - Soft delete flag
   * @returns {Promise<Object>} Delete result
   */
  async deleteProject(id, soft = true) {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }

      let result;
      if (soft) {
        result = await projectRepository.softDelete(id);
      } else {
        // Clean up files before hard delete
        await this.cleanupProjectFiles(project);
        result = await projectRepository.delete(id);
      }
      
      return {
        success: true,
        message: `Project ${soft ? 'deactivated' : 'deleted'} successfully`,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle project active status
   * @param {string} id - Project ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<Object>} Update result
   */
  async toggleProjectStatus(id, isActive) {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }

      const updatedProject = await projectRepository.update(id, { isActive });
      
      return {
        success: true,
        message: `Project ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: updatedProject
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search projects
   * @param {string} searchTerm - Search term
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchProjects(searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Search term must be at least 2 characters long');
      }

      const projects = await projectRepository.search(searchTerm.trim(), options);
      
      return {
        success: true,
        data: projects,
        searchTerm: searchTerm.trim()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get project statistics
   * @returns {Promise<Object>} Project statistics
   */
  async getProjectStats() {
    try {
      const stats = await projectRepository.getStats();
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process file uploads and return updated data with file paths
   * @param {Object} data - Original data
   * @param {Object} files - Uploaded files
   * @param {Object} existingProject - Existing project for updates
   * @returns {Promise<Object>} Processed data with file paths
   */
  async processFileUploads(data, files = {}, existingProject = null) {
    const processedData = { ...data };
    
    console.log('🔍 processFileUploads START: aboutUsDetail:', JSON.stringify(processedData.aboutUsDetail, null, 2));
    
    // Create project-specific folder based on projectTitle
    const projectFolderName = this.createSafeDirectoryName(data.projectTitle || existingProject?.projectTitle || 'untitled');
    const uploadDir = path.join(process.cwd(), 'uploads', 'projects', projectFolderName);

    // Ensure upload directory exists
    await this.ensureDirectoryExists(uploadDir);

    try {
      // Process brochure file
      if (files.brochure && files.brochure[0]) {
        const brochurePath = await this.saveFile(files.brochure[0], uploadDir, 'brochure', projectFolderName);
        processedData.brochure = brochurePath;
        
        // Delete old brochure if updating
        if (existingProject && existingProject.brochure) {
          await this.deleteFile(existingProject.brochure);
        }
      }

      // Process about us image and update aboutUsDetail
      if (files.aboutUsImage && files.aboutUsImage[0]) {
        const aboutUsImagePath = await this.saveFile(files.aboutUsImage[0], uploadDir, 'about', projectFolderName);
        
        // Update aboutUsDetail.image.url (preserve existing description fields)
        if (!processedData.aboutUsDetail) {
          processedData.aboutUsDetail = {
            description1: '',
            description2: '',
            description3: '',
            description4: '',
            image: {}
          };
        }
        if (!processedData.aboutUsDetail.image) {
          processedData.aboutUsDetail.image = {};
        }
        
        processedData.aboutUsDetail.image.url = aboutUsImagePath;
        
        console.log('🔍 Service: aboutUsDetail after image processing:', JSON.stringify(processedData.aboutUsDetail, null, 2));
        
        // Delete old about us image if updating
        if (existingProject && existingProject.aboutUsDetail && existingProject.aboutUsDetail.image && existingProject.aboutUsDetail.image.url) {
          await this.deleteFile(existingProject.aboutUsDetail.image.url);
        }
      } else if (data.deleteAboutImage === 'true' && existingProject) {
        // User wants to delete the about us image
        if (existingProject.aboutUsDetail && existingProject.aboutUsDetail.image && existingProject.aboutUsDetail.image.url) {
          await this.deleteFile(existingProject.aboutUsDetail.image.url);
          console.log('🔍 Service: Deleted about us image');
        }
        // Clear the image URL but preserve alt text and descriptions
        if (processedData.aboutUsDetail && processedData.aboutUsDetail.image) {
          processedData.aboutUsDetail.image.url = '';
        }
      } else {
        // No image uploaded, ensure aboutUsDetail structure exists
        if (processedData.aboutUsDetail) {
          console.log('🔍 Service: No image uploaded, preserving description fields');
          if (!processedData.aboutUsDetail.image) {
            processedData.aboutUsDetail.image = { alt: processedData.aboutUsDetail.image?.alt || '' };
          }
        }
      }

      // Process floor plan images
      if (files.floorPlanImages && files.floorPlanImages.length > 0) {
        const floorPlanPaths = [];
        for (let i = 0; i < files.floorPlanImages.length; i++) {
          const floorPlanPath = await this.saveFile(files.floorPlanImages[i], uploadDir, `floorplan_${i + 1}`, projectFolderName);
          floorPlanPaths.push(floorPlanPath);
        }

        // Update floor plan data with image paths
        if (processedData.floorPlans && Array.isArray(processedData.floorPlans)) {
          processedData.floorPlans.forEach((plan, index) => {
            if (floorPlanPaths[index]) {
              plan.image = floorPlanPaths[index];
            }
          });
        }

        // Delete old floor plan images if updating
        if (existingProject && existingProject.floorPlans) {
          for (const plan of existingProject.floorPlans) {
            if (plan.image) {
              await this.deleteFile(plan.image);
            }
          }
        }
      }

      // Process project images
      if (files.projectImageFiles && files.projectImageFiles.length > 0) {
        const projectImagePaths = [];
        for (let i = 0; i < files.projectImageFiles.length; i++) {
          const projectImagePath = await this.saveFile(files.projectImageFiles[i], uploadDir, `project_${i + 1}`, projectFolderName);
          projectImagePaths.push(projectImagePath);
        }

        // Update project image data with image paths
        if (processedData.projectImages && Array.isArray(processedData.projectImages)) {
          processedData.projectImages.forEach((img, index) => {
            if (projectImagePaths[index]) {
              img.image = projectImagePaths[index];
            }
          });
        }

        // Delete old project images if updating
        if (existingProject && existingProject.projectImages) {
          for (const img of existingProject.projectImages) {
            if (img.image) {
              await this.deleteFile(img.image);
            }
          }
        }
      }

      // Process amenity files
      if (files.amenityFiles && files.amenityFiles.length > 0) {
        const amenityPaths = [];
        for (let i = 0; i < files.amenityFiles.length; i++) {
          const amenityPath = await this.saveFile(files.amenityFiles[i], uploadDir, `amenity_${i + 1}`, projectFolderName);
          amenityPaths.push(amenityPath);
        }

        // Update amenity data with image paths
        if (processedData.amenities && Array.isArray(processedData.amenities)) {
          processedData.amenities.forEach((amenity, index) => {
            if (amenityPaths[index]) {
              amenity.svgOrImage = amenityPaths[index];
            }
          });
        }

        // Delete old amenity files if updating
        if (existingProject && existingProject.amenities) {
          for (const amenity of existingProject.amenities) {
            if (amenity.svgOrImage) {
              await this.deleteFile(amenity.svgOrImage);
            }
          }
        }
      }

      // Process updated image files
      if (files.updatedImageFiles && files.updatedImageFiles.length > 0) {
        const updatedImagePaths = [];
        for (let i = 0; i < files.updatedImageFiles.length; i++) {
          const updatedImagePath = await this.saveFile(files.updatedImageFiles[i], uploadDir, `updated_${i + 1}`, projectFolderName);
          updatedImagePaths.push(updatedImagePath);
        }

        // Update updated image data with image paths
        if (processedData.updatedImages && Array.isArray(processedData.updatedImages)) {
          processedData.updatedImages.forEach((img, index) => {
            if (updatedImagePaths[index]) {
              img.image = updatedImagePaths[index];
            }
          });
        }

        // Delete old updated images if updating
        if (existingProject && existingProject.updatedImages) {
          for (const img of existingProject.updatedImages) {
            if (img.image) {
              await this.deleteFile(img.image);
            }
          }
        }
      }

      // Process card image
      if (files.cardImage && files.cardImage[0]) {
        const cardImagePath = await this.saveFile(files.cardImage[0], uploadDir, 'card', projectFolderName);
        processedData.cardImage = cardImagePath;
        
        // Delete old card image if updating
        if (existingProject && existingProject.cardImage) {
          await this.deleteFile(existingProject.cardImage);
        }
      }

      console.log('🔍 processFileUploads END: aboutUsDetail:', JSON.stringify(processedData.aboutUsDetail, null, 2));
      
      return processedData;
    } catch (error) {
      throw new Error(`File upload processing failed: ${error.message}`);
    }
  }

  /**
   * Save uploaded file with dynamic naming
   * @param {Object} file - Multer file object
   * @param {string} uploadDir - Upload directory
   * @param {string} prefix - File name prefix
   * @param {string} projectFolderName - Project folder name
   * @returns {Promise<string>} File path
   */
  async saveFile(file, uploadDir, prefix, projectFolderName) {
    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileExtension = path.extname(file.originalname);
      const fileName = `${prefix}_${timestamp}_${randomStr}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Write file to disk
      await fs.writeFile(filePath, file.buffer);

      // Return relative path for database storage
      return path.join('uploads', 'projects', projectFolderName, fileName).replace(/\\/g, '/');
    } catch (error) {
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Ensure directory exists
   * @param {string} dirPath - Directory path
   */
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Delete a file
   * @param {string} filePath - File path to delete
   */
  async deleteFile(filePath) {
    try {
      if (filePath) {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      }
    } catch (error) {
      // Ignore file not found errors
      console.warn(`Failed to delete file: ${filePath}`, error.message);
    }
  }

  /**
   * Clean up uploaded files
   * @param {Object} files - Files to clean up
   */
  async cleanupFiles(files) {
    const filesToCleanup = [];
    
    // Collect all files
    Object.values(files).forEach(fileArray => {
      if (Array.isArray(fileArray)) {
        filesToCleanup.push(...fileArray);
      } else {
        filesToCleanup.push(fileArray);
      }
    });

    // Delete files
    for (const file of filesToCleanup) {
      if (file && file.path) {
        await this.deleteFile(file.path);
      }
    }
  }

  /**
   * Extract all saved file paths from processed data
   * @param {Object} processedData - Processed project data
   * @returns {Array} Array of file paths
   */
  extractSavedFilePaths(processedData) {
    const filePaths = [];
    
    // Add main file paths
    if (processedData.brochure) filePaths.push(processedData.brochure);
    if (processedData.aboutUsDetail && processedData.aboutUsDetail.image && processedData.aboutUsDetail.image.url) {
      filePaths.push(processedData.aboutUsDetail.image.url);
    }
    if (processedData.cardImage) filePaths.push(processedData.cardImage);
    
    // Add floor plan images
    if (processedData.floorPlans && Array.isArray(processedData.floorPlans)) {
      processedData.floorPlans.forEach(fp => {
        if (fp.image) filePaths.push(fp.image);
      });
    }
    
    // Add project images
    if (processedData.projectImages && Array.isArray(processedData.projectImages)) {
      processedData.projectImages.forEach(img => {
        if (img.image) filePaths.push(img.image);
      });
    }
    
    // Add amenity images
    if (processedData.amenities && Array.isArray(processedData.amenities)) {
      processedData.amenities.forEach(amenity => {
        if (amenity.svgOrImage) filePaths.push(amenity.svgOrImage);
      });
    }
    
    // Add updated images
    if (processedData.updatedImages && Array.isArray(processedData.updatedImages)) {
      processedData.updatedImages.forEach(img => {
        if (img.image) filePaths.push(img.image);
      });
    }
    
    return filePaths;
  }

  /**
   * Extract only new file paths (not present in existing project)
   * @param {Object} processedData - Processed project data
   * @param {Object} existingProject - Existing project data
   * @returns {Array} Array of new file paths only
   */
  extractNewFilePaths(processedData, existingProject) {
    const allNewPaths = this.extractSavedFilePaths(processedData);
    const existingPaths = this.extractSavedFilePaths(existingProject);
    
    // Return only paths that are new (not in existing project)
    return allNewPaths.filter(path => !existingPaths.includes(path));
  }

  /**
   * Clean up saved files by file paths
   * @param {Array} filePaths - Array of file paths to delete
   */
  async cleanupSavedFiles(filePaths) {
    if (!filePaths || filePaths.length === 0) {
      return;
    }
    
  // Cleaning up saved files
    
    for (const filePath of filePaths) {
      try {
        if (filePath) {
          const fullPath = path.join(process.cwd(), filePath);
          await fs.unlink(fullPath);
        }
      } catch (error) {
        console.warn(`Failed to delete file ${filePath}:`, error.message);
      }
    }
  }

  /**
   * Clean up all files associated with a project
   * @param {Object} project - Project object
   */
  async cleanupProjectFiles(project) {
    const filesToDelete = [];

    // Collect all file paths
    if (project.brochure) filesToDelete.push(project.brochure);
    if (project.aboutUsDetail && project.aboutUsDetail.image && project.aboutUsDetail.image.url) {
      filesToDelete.push(project.aboutUsDetail.image.url);
    }
    if (project.cardImage) filesToDelete.push(project.cardImage);

    // Floor plan images
    if (project.floorPlans) {
      project.floorPlans.forEach(plan => {
        if (plan.image) filesToDelete.push(plan.image);
      });
    }

    // Project images
    if (project.projectImages) {
      project.projectImages.forEach(img => {
        if (img.image) filesToDelete.push(img.image);
      });
    }

    // Amenity files
    if (project.amenities) {
      project.amenities.forEach(amenity => {
        if (amenity.svgOrImage) filesToDelete.push(amenity.svgOrImage);
      });
    }

    // Updated images
    if (project.updatedImages) {
      project.updatedImages.forEach(img => {
        if (img.image) filesToDelete.push(img.image);
      });
    }

    // Delete all files
    for (const filePath of filesToDelete) {
      await this.deleteFile(filePath);
    }
  }

  /**
   * Create a safe directory name from project title
   * @param {string} title - Project title
   * @returns {string} Safe directory name
   */
  createSafeDirectoryName(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50) // Limit length to 50 characters
      || 'untitled'; // Fallback if title becomes empty
  }
}

module.exports = new ProjectService();
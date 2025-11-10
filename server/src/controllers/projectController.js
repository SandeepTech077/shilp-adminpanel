const projectService = require('../services/projectService');
const { validationResult } = require('express-validator');

class ProjectController {
  /**
   * Create a new project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createProject = async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      // Debug: Log received data (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Raw request body:', req.body);
        console.log('Received files:', Object.keys(req.files || {}));
        console.log('aboutUsDescriptions keys:', Object.keys(req.body).filter(key => key.includes('aboutUsDescriptions')));
      }

      // Parse form data
      const parsedData = this.parseFormData(req.body);
      
      // Add unique slug generation
      parsedData.slug = await this.generateUniqueSlug(parsedData.projectTitle);
      
      console.log('Parsed data for project creation:', JSON.stringify(parsedData, null, 2));
      console.log('aboutUsDescriptions:', JSON.stringify(parsedData.aboutUsDescriptions, null, 2));
      
      // Ensure mobile numbers have +91 prefix (if not already present)
      if (parsedData.number1) {
        parsedData.number1 = parsedData.number1.startsWith('+91') 
          ? parsedData.number1 
          : `+91${parsedData.number1}`;
      }
      if (parsedData.number2) {
        parsedData.number2 = parsedData.number2.startsWith('+91') 
          ? parsedData.number2 
          : `+91${parsedData.number2}`;
      }

      // Ensure slug is not empty or null
      if (!parsedData.slug || parsedData.slug.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Slug is required and cannot be empty',
          errors: [{ field: 'slug', message: 'Slug is required and cannot be empty' }]
        });
      }

      // Create project with uploaded files
      const result = await projectService.createProject(parsedData, req.files);

      res.status(201).json(result);
    } catch (error) {
      console.error('Create project error:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to create project';
      let statusCode = 400;
      
      if (error.message.includes('duplicate key error')) {
        errorMessage = 'A project with this slug already exists. Please use a different project title or slug.';
        statusCode = 409; // Conflict
      } else if (error.message.includes('validation failed')) {
        errorMessage = 'Validation failed. Please check all required fields.';
        statusCode = 400; // Bad Request
      } else if (error.message.includes('Slug already exists')) {
        errorMessage = error.message;
        statusCode = 409; // Conflict
      } else if (error.name === 'ValidationError') {
        errorMessage = 'Invalid data provided. Please check all fields.';
        statusCode = 400; // Bad Request
      }
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get all projects with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllProjects(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        state,
        type,
        search
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sort]: order === 'desc' ? -1 : 1 }
      };

      // Add filters
      const filter = {};
      if (state) filter.projectState = state;
      if (type) filter.cardProjectType = type;
      
      options.filter = filter;

      let result;
      if (search) {
        result = await projectService.searchProjects(search, options);
      } else {
        result = await projectService.getAllProjects(options);
      }

      res.json(result);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch projects',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get project by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID format'
        });
      }

      const result = await projectService.getProjectById(id);
      res.json(result);
    } catch (error) {
      console.error('Get project by ID error:', error);
      const statusCode = error.message === 'Project not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch project',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get project by slug
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProjectBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      if (!slug) {
        return res.status(400).json({
          success: false,
          message: 'Slug is required'
        });
      }

      const result = await projectService.getProjectBySlug(slug);
      res.json(result);
    } catch (error) {
      console.error('Get project by slug error:', error);
      const statusCode = error.message === 'Project not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch project',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get projects by state
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProjectsByState(req, res) {
    try {
      const { state } = req.params;
      const { limit = 10 } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };

      const result = await projectService.getProjectsByState(state, options);
      res.json(result);
    } catch (error) {
      console.error('Get projects by state error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch projects by state',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get projects by type
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProjectsByType(req, res) {
    try {
      const { type } = req.params;
      const { limit = 10 } = req.query;

      const options = {
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };

      const result = await projectService.getProjectsByType(type, options);
      res.json(result);
    } catch (error) {
      console.error('Get projects by type error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch projects by type',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Update project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID format'
        });
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      // Parse array data from form
      const updateData = this.parseFormData(req.body);

      // Update project with uploaded files
      const result = await projectService.updateProject(id, updateData, req.files);

      res.json(result);
    } catch (error) {
      console.error('Update project error:', error);
      const statusCode = error.message === 'Project not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update project',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Delete project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      const { permanent = false } = req.query;
      
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID format'
        });
      }

      const result = await projectService.deleteProject(id, !permanent);
      res.json(result);
    } catch (error) {
      console.error('Delete project error:', error);
      const statusCode = error.message === 'Project not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete project',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Search projects
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchProjects(req, res) {
    try {
      const { q: searchTerm, limit = 10 } = req.query;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const options = {
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };

      const result = await projectService.searchProjects(searchTerm, options);
      res.json(result);
    } catch (error) {
      console.error('Search projects error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to search projects',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get project statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProjectStats(req, res) {
    try {
      const result = await projectService.getProjectStats();
      res.json(result);
    } catch (error) {
      console.error('Get project stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch project statistics',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Parse form data arrays from multipart/form-data
   * @param {Object} body - Request body
   * @returns {Object} Parsed data
   */
  parseFormData(body) {
    const parsed = { ...body };

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Parsing form data...');
      console.log('Raw body keys:', Object.keys(body));
    }

    // Parse aboutUsDescriptions array  
    const aboutUsKeys = Object.keys(body).filter(key => key.startsWith('aboutUsDescriptions['));
    if (aboutUsKeys.length > 0) {
      parsed.aboutUsDescriptions = [];
      aboutUsKeys.forEach(key => {
        const match = key.match(/aboutUsDescriptions\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const text = body[key];
          if (text && text.trim()) { // Only add non-empty descriptions
            if (!parsed.aboutUsDescriptions[index]) {
              parsed.aboutUsDescriptions[index] = {};
            }
            parsed.aboutUsDescriptions[index].text = text.trim();
          }
        }
      });
      // Filter out any undefined entries
      parsed.aboutUsDescriptions = parsed.aboutUsDescriptions.filter(desc => desc && desc.text);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Parsed aboutUsDescriptions:', parsed.aboutUsDescriptions);
      }
    } else if (body.aboutUsDescriptions) {
      // Handle case where aboutUsDescriptions is sent as a direct string
      if (typeof body.aboutUsDescriptions === 'string' && body.aboutUsDescriptions.trim()) {
        parsed.aboutUsDescriptions = [{ text: body.aboutUsDescriptions.trim() }];
      } else {
        parsed.aboutUsDescriptions = [];
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Parsed aboutUsDescriptions (fallback):', parsed.aboutUsDescriptions);
      }
    } else {
      parsed.aboutUsDescriptions = [];
    }

    // Parse floor plans array
    const floorPlanKeys = Object.keys(body).filter(key => key.startsWith('floorPlans['));
    if (floorPlanKeys.length > 0) {
      parsed.floorPlans = [];
      floorPlanKeys.forEach(key => {
        const match = key.match(/floorPlans\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (!parsed.floorPlans[index]) {
            parsed.floorPlans[index] = {};
          }
          parsed.floorPlans[index][field] = body[key];
        }
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Parsed floorPlans:', parsed.floorPlans);
      }
    }

    // Parse project images array
    const projectImageKeys = Object.keys(body).filter(key => key.startsWith('projectImages['));
    if (projectImageKeys.length > 0) {
      parsed.projectImages = [];
      projectImageKeys.forEach(key => {
        const match = key.match(/projectImages\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (!parsed.projectImages[index]) {
            parsed.projectImages[index] = {};
          }
          parsed.projectImages[index][field] = body[key];
        }
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Parsed projectImages:', parsed.projectImages);
      }
    }

    // Parse amenities array
    const amenityKeys = Object.keys(body).filter(key => key.startsWith('amenities['));
    if (amenityKeys.length > 0) {
      parsed.amenities = [];
      amenityKeys.forEach(key => {
        const match = key.match(/amenities\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (!parsed.amenities[index]) {
            parsed.amenities[index] = {};
          }
          parsed.amenities[index][field] = body[key];
        }
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Parsed amenities:', parsed.amenities);
      }
    }

    // Parse updated images array
    const updatedImageKeys = Object.keys(body).filter(key => key.startsWith('updatedImages['));
    if (updatedImageKeys.length > 0) {
      parsed.updatedImages = [];
      updatedImageKeys.forEach(key => {
        const match = key.match(/updatedImages\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          if (!parsed.updatedImages[index]) {
            parsed.updatedImages[index] = {};
          }
          parsed.updatedImages[index][field] = body[key];
        }
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Parsed updatedImages:', parsed.updatedImages);
      }
    }

    return parsed;
  }

  /**
   * Generate slug from project title
   * @param {string} title - Project title
   * @returns {string} Generated slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }

  /**
   * Generate unique slug by checking for conflicts
   * @param {string} title - Project title
   * @returns {string} Unique slug
   */
  async generateUniqueSlug(title) {
    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and append counter if needed
    while (await projectService.checkSlugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}

module.exports = new ProjectController();
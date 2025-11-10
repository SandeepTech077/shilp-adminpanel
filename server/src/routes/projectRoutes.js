const express = require('express');
const multer = require('multer');
const path = require('path');
const projectController = require('../controllers/projectController');
const projectValidation = require('../middleware/projectValidation');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Use memory storage for processing

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.fieldname === 'brochure') {
    // PDF only for brochure
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Brochure must be a PDF file'), false);
    }
  } else {
    // Images for all other fields
    if (file.mimetype.startsWith('image/') || 
        (file.fieldname.includes('amenity') && file.mimetype === 'image/svg+xml')) {
      cb(null, true);
    } else {
      cb(new Error(`${file.fieldname} must be an image file`), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 20 // Maximum 20 files per request
  }
});

// Define multer fields for file uploads
const uploadFields = upload.fields([
  { name: 'brochure', maxCount: 1 },
  { name: 'aboutUsImage', maxCount: 1 },
  { name: 'floorPlanImages', maxCount: 10 },
  { name: 'projectImageFiles', maxCount: 5 },
  { name: 'amenityFiles', maxCount: 20 },
  { name: 'updatedImageFiles', maxCount: 3 },
  { name: 'cardImage', maxCount: 1 }
]);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB per file.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Check the file limits for each field.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please check the allowed file fields.'
      });
    }
  }
  
  if (err.message.includes('must be')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// Public routes (no authentication required)

/**
 * @route   GET /api/projects
 * @desc    Get all active projects with filtering and pagination
 * @access  Public
 * @query   page, limit, sort, order, state, type, search
 */
router.get('/', 
  projectValidation.queryParams,
  projectController.getAllProjects
);

/**
 * @route   GET /api/projects/stats
 * @desc    Get project statistics
 * @access  Public
 */
router.get('/stats', projectController.getProjectStats);

/**
 * @route   GET /api/projects/search
 * @desc    Search projects
 * @access  Public
 * @query   q (search term), limit
 */
router.get('/search', 
  projectValidation.queryParams,
  projectController.searchProjects
);

/**
 * @route   GET /api/projects/state/:state
 * @desc    Get projects by state (on-going, completed)
 * @access  Public
 * @query   limit
 */
router.get('/state/:state', 
  projectValidation.projectState,
  projectValidation.queryParams,
  projectController.getProjectsByState
);

/**
 * @route   GET /api/projects/type/:type
 * @desc    Get projects by type (residential, commercial, plot)
 * @access  Public
 * @query   limit
 */
router.get('/type/:type', 
  projectValidation.projectType,
  projectValidation.queryParams,
  projectController.getProjectsByType
);

/**
 * @route   GET /api/projects/slug/:slug
 * @desc    Get project by slug
 * @access  Public
 */
router.get('/slug/:slug', 
  projectValidation.projectSlug,
  projectController.getProjectBySlug
);

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get('/:id', 
  projectValidation.projectId,
  projectController.getProjectById
);

// Protected routes (authentication required)

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private (Admin only)
 * @files   brochure, aboutUsImage, floorPlanImages, projectImageFiles, amenityFiles, updatedImageFiles, cardImage
 */
router.post('/', 
  adminAuth.verifyToken,
  adminAuth.requirePermission('projects.create'),
  uploadFields,
  handleMulterError,
  projectValidation.createProject,
  projectController.createProject
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project by ID
 * @access  Private (Admin only)
 * @files   brochure, aboutUsImage, floorPlanImages, projectImageFiles, amenityFiles, updatedImageFiles, cardImage
 */
router.put('/:id', 
  adminAuth.verifyToken,
  adminAuth.requirePermission('projects.update'),
  projectValidation.projectId,
  uploadFields,
  handleMulterError,
  projectValidation.updateProject,
  projectController.updateProject
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project by ID (soft delete by default, permanent if ?permanent=true)
 * @access  Private (Admin only)
 * @query   permanent (boolean)
 */
router.delete('/:id', 
  adminAuth.verifyToken,
  adminAuth.requirePermission('projects.delete'),
  projectValidation.projectId,
  projectController.deleteProject
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Project routes error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = router;
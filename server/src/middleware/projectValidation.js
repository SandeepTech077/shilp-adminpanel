const { body, param, query } = require('express-validator');
const projectRepository = require('../repositories/projectRepository');

const projectValidation = {
  // Validation for creating a new project
  createProject: [
    body('projectTitle')
      .trim()
      .notEmpty()
      .withMessage('Project title is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Project title must be between 3 and 200 characters'),

    body('slug')
      .trim()
      .notEmpty()
      .withMessage('Slug is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Slug must be between 3 and 100 characters')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
      .custom(async (value) => {
        if (!value || value.trim() === '') {
          throw new Error('Slug cannot be empty');
        }
        const exists = await projectRepository.slugExists(value.trim());
        if (exists) {
          throw new Error(`Project with slug '${value}' already exists`);
        }
        return true;
      }),

    body('shortAddress')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 300 })
      .withMessage('Short address must be between 2 and 300 characters'),

    body('locationTitle')
      .trim()
      .notEmpty()
      .withMessage('Location title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Location title must be between 3 and 100 characters'),

    body('locationTitleText')
      .trim()
      .notEmpty()
      .withMessage('Location description is required')
      .isLength({ min: 5, max: 1000 })
      .withMessage('Location description must be between 5 and 1000 characters'),

    body('locationArea')
      .trim()
      .notEmpty()
      .withMessage('Location area is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Location area must be between 3 and 100 characters'),

    body('number1')
      .trim()
      .notEmpty()
      .withMessage('Primary mobile number is required')
      .matches(/^(\+91)?[6-9]\d{9}$/)
      .withMessage('Primary mobile number must be a valid Indian mobile number'),

    body('number2')
      .trim()
      .notEmpty()
      .withMessage('Secondary mobile number is required')
      .matches(/^(\+91)?[6-9]\d{9}$/)
      .withMessage('Secondary mobile number must be a valid Indian mobile number'),

    body('email1')
      .trim()
      .notEmpty()
      .withMessage('Primary email is required')
      .isEmail()
      .withMessage('Primary email must be a valid email address')
      .normalizeEmail(),

    body('email2')
      .trim()
      .notEmpty()
      .withMessage('Secondary email is required')
      .isEmail()
      .withMessage('Secondary email must be a valid email address')
      .normalizeEmail(),

    body('cardLocation')
      .trim()
      .notEmpty()
      .withMessage('Card location is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Card location must be between 3 and 100 characters'),

    body('cardAreaFt')
      .trim()
      .notEmpty()
      .withMessage('Card area is required')
      .isLength({ min: 1, max: 20 })
      .withMessage('Card area must be between 1 and 20 characters'),

    body('reraNumber')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('RERA number must be between 5 and 200 characters'),

    body('projectState')
      .isIn(['on-going', 'completed'])
      .withMessage('Project state must be either "on-going" or "completed"'),

    body('projectType')
      .isIn(['residential', 'commercial', 'plot'])
      .withMessage('Project type must be either "residential", "commercial", or "plot"'),

    body('shortAddress')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isLength({ min: 2, max: 300 })
      .withMessage('Short address must be between 2 and 300 characters'),

    body('projectStatusPercentage')
      .isInt({ min: 0, max: 100 })
      .withMessage('Project status percentage must be between 0 and 100'),

    // About Us Descriptions validation (4 individual fields)
    body('description1')
      .trim()
      .notEmpty()
      .withMessage('At least one description is required')
      .isLength({ max: 2000 })
      .withMessage('Description 1 cannot exceed 2000 characters'),

    body('description2')
      .optional({ checkFalsy: false })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 2 cannot exceed 2000 characters'),

    body('description3')
      .optional({ checkFalsy: false })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 3 cannot exceed 2000 characters'),

    body('description4')
      .optional({ checkFalsy: false })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 4 cannot exceed 2000 characters'),

    body('aboutUsAlt')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('About us alt text cannot exceed 200 characters'),

    body('youtubeUrl')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isURL()
      .withMessage('YouTube URL must be a valid URL'),

    body('updatedImagesTitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Updated images title cannot exceed 200 characters'),

    body('locationTitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Location title cannot exceed 200 characters'),

    body('locationTitleText')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Location title text cannot exceed 200 characters'),

    body('locationArea')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location area cannot exceed 100 characters'),

    body('number1')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Phone number 1 must be a valid phone number'),

    body('number2')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Phone number 2 must be a valid phone number'),

    body('email1')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Email 1 must be a valid email address'),

    body('email2')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Email 2 must be a valid email address'),

    body('mapIframeUrl')
      .optional()
      .trim()
      .isURL()
      .withMessage('Map iframe URL must be a valid URL'),

    body('cardLocation')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Card location cannot exceed 200 characters'),

    body('cardAreaFt')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Card area cannot exceed 50 characters'),

    body('cardProjectType')
      .notEmpty()
      .withMessage('Card project type is required')
      .isIn(['residential', 'commercial', 'plot'])
      .withMessage('Card project type must be one of: residential, commercial, plot'),

    body('cardHouse')
      .notEmpty()
      .withMessage('Card house status is required')
      .isIn(['Ready to Move', 'Sample House Ready'])
      .withMessage('Card house status must be either "Ready to Move" or "Sample House Ready"'),

    body('reraNumber')
  .optional()
  .trim()
,
  ],

  // Validation for updating a project (same as create but all fields optional)
  updateProject: [
    body('projectTitle')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project title cannot be empty')
      .isLength({ min: 3, max: 200 })
      .withMessage('Project title must be between 3 and 200 characters'),

    body('slug')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Slug cannot be empty')
      .isLength({ min: 3, max: 100 })
      .withMessage('Slug must be between 3 and 100 characters')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),

    body('projectState')
      .optional()
      .isIn(['on-going', 'completed'])
      .withMessage('Project state must be either "on-going" or "completed"'),

    body('projectType')
      .optional()
      .isIn(['residential', 'commercial', 'plot'])
      .withMessage('Project type must be either "residential", "commercial", or "plot"'),

    body('shortAddress')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Short address cannot be empty')
      .isLength({ max: 300 })
      .withMessage('Short address cannot exceed 300 characters'),

    body('projectStatusPercentage')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Project status percentage must be between 0 and 100'),

    // About Us Descriptions validation (4 individual fields)
    body('description1')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 1 cannot exceed 2000 characters'),

    body('description2')
      .optional({ checkFalsy: false })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 2 cannot exceed 2000 characters'),

    body('description3')
      .optional({ checkFalsy: false })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 3 cannot exceed 2000 characters'),

    body('description4')
      .optional({ checkFalsy: false })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description 4 cannot exceed 2000 characters'),

    body('aboutUsAlt')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('About us alt text cannot exceed 200 characters'),

    body('youtubeUrl')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isURL()
      .withMessage('YouTube URL must be a valid URL'),

    body('updatedImagesTitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Updated images title cannot exceed 200 characters'),

    body('locationTitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Location title cannot exceed 200 characters'),

    body('locationTitleText')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Location title text cannot exceed 200 characters'),

    body('locationArea')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Location area cannot exceed 100 characters'),

    body('number1')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Phone number 1 must be a valid phone number'),

    body('number2')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Phone number 2 must be a valid phone number'),

    body('email1')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Email 1 must be a valid email address'),

    body('email2')
      .optional()
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('Email 2 must be a valid email address'),

    body('mapIframeUrl')
      .optional({ nullable: true, checkFalsy: true })
      .trim()
      .isURL()
      .withMessage('Map iframe URL must be a valid URL'),

    body('cardLocation')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Card location cannot exceed 200 characters'),

    body('cardAreaFt')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Card area cannot exceed 50 characters'),

    body('cardProjectType')
      .optional()
      .isIn(['residential', 'commercial', 'plot'])
      .withMessage('Card project type must be one of: residential, commercial, plot'),

    body('cardHouse')
      .optional()
      .isIn(['Ready to Move', 'Sample House Ready'])
      .withMessage('Card house status must be either "Ready to Move" or "Sample House Ready"'),

    body('reraNumber')
      .optional({ nullable: true, checkFalsy: true })
      .trim(),
  ],

  // Validation for project ID parameter
  projectId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid project ID format')
  ],

  // Validation for project slug parameter
  projectSlug: [
    param('slug')
      .trim()
      .notEmpty()
      .withMessage('Slug is required')
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Invalid slug format')
  ],

  // Validation for project state parameter
  projectState: [
    param('state')
      .isIn(['on-going', 'completed'])
      .withMessage('State must be either "on-going" or "completed"')
  ],

  // Validation for project type parameter
  projectType: [
    param('type')
      .isIn(['residential', 'commercial', 'plot'])
      .withMessage('Type must be one of: residential, commercial, plot')
  ],

  // Validation for query parameters
  queryParams: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),

    query('sort')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'projectTitle', 'projectStatusPercentage'])
      .withMessage('Sort field must be one of: createdAt, updatedAt, projectTitle, projectStatusPercentage'),

    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be either "asc" or "desc"'),

    query('state')
      .optional()
      .isIn(['on-going', 'completed'])
      .withMessage('State filter must be either "on-going" or "completed"'),

    query('type')
      .optional()
      .isIn(['residential', 'commercial', 'plot'])
      .withMessage('Type filter must be one of: residential, commercial, plot'),

    query('search')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search term must be at least 2 characters long'),

    query('q')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters long')
  ]
};

module.exports = projectValidation;
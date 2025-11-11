const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const bannerRoutes = require('./routes/bannerRoutes'); // Added bannerRoutes require
const projectRoutes = require('./routes/projectRoutes'); // Added projectRoutes require
const projectTreeRoutes = require('./routes/projectTreeRoutes'); // Added projectTreeRoutes require
const blogRoutes = require('./routes/blogRoutes'); // Added blogRoutes require
require('dotenv').config();

const { connectDatabase } = require('./config/database');

// Routes
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
const PORT = process.env.PORT || 8081;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression());

// Logging middleware - Disabled to reduce console clutter
// if (process.env.NODE_ENV !== 'test') {
//   app.use(morgan('combined'));
// }

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads with enhanced CORS headers
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for static files
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CORS_ORIGIN
  ].filter(Boolean);
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5174');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}, express.static(uploadDir, {
  // Add 404 handling for missing files
  fallthrough: false,
  setHeaders: (res, path) => {
    // Additional headers for static files
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Add 404 handler for missing upload files
app.use('/uploads', (err, req, res, next) => {
  if (err && err.status === 404) {
    res.status(404).json({
      success: false,
      message: 'Image not found',
      path: req.url
    });
  } else {
    next(err);
  }
});

// Routes without rate limiting
app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/banners', bannerRoutes); // Mount banner routes with proper API prefix
app.use('/api/projects', projectRoutes); // Mount project routes with proper API prefix
app.use('/api/projecttree', projectTreeRoutes); // Mount project tree routes with proper API prefix
app.use('/api/blogs', blogRoutes); // Mount blog routes with proper API prefix
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    app.listen(PORT, () => {
      // Server started
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  // SIGTERM received
  process.exit(0);
});

process.on('SIGINT', () => {
  // SIGINT received
  process.exit(0);
});

// Fix: Use async IIFE for top-level await
(async () => {
  await startServer();
})();

module.exports = app;
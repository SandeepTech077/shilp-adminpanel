const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bannerRoutes = require('./routes/bannerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectTreeRoutes = require('./routes/projectTreeRoutes');
const blogRoutes = require('./routes/blogRoutes');
const publicRoutes = require('./routes/publicRoutes');
require('dotenv').config();

const { connectDatabase } = require('./config/database');

const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
const PORT = process.env.PORT || 8081;

app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://localhost:3000',
      'http://192.168.2.143:5173',
      'http://192.168.2.143:5174', 
      'http://192.168.2.143:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      // Add common development ports
      'http://localhost:4173',
      'http://localhost:4174',
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('🔓 Request with no origin - allowing');
      return callback(null, true);
    }
    
    console.log(`🔍 Checking origin: ${origin}`);
    
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Origin allowed: ${origin}`);
      callback(null, true);
    } else {
      console.log(`❌ Origin not allowed: ${origin}`);
      console.log(`📋 Allowed origins:`, allowedOrigins);
      
      // In development, be more permissive for localhost
      if (process.env.NODE_ENV !== 'production' && 
          (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        console.log(`🔧 Development mode - allowing localhost origin: ${origin}`);
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(compression());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  const allowedStaticOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://localhost:4174',
    'http://192.168.2.143:5173',
    'http://192.168.2.143:5174', 
    'http://192.168.2.143:5175',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://10.13.218.10:5174',
    process.env.CORS_ORIGIN
  ].filter(Boolean);
  
  console.log(`📁 Static file request from origin: ${origin || 'no-origin'}`);
  
  if (origin && allowedStaticOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`✅ Static file access allowed for: ${origin}`);
  } else if (!origin) {
    // Allow requests with no origin for direct file access
    res.header('Access-Control-Allow-Origin', '*');
  } else if (process.env.NODE_ENV !== 'production' && 
             (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    // Development mode - allow localhost
    res.header('Access-Control-Allow-Origin', origin);
    console.log(`🔧 Dev mode - Static file access allowed for: ${origin}`);
  } else {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:5174');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cache-Control', 'public, max-age=31536000');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}, express.static(uploadDir, {
  fallthrough: false,
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

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

app.use('/api/health', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projecttree', projectTreeRoutes);
app.use('/api/blogs', blogRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Send error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Network: http://192.168.2.143:${PORT}`);
      console.log(`🏠 Local: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});

(async () => {
  await startServer();
})();

module.exports = app;
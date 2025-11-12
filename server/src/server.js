const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bannerRoutes = require('./routes/bannerRoutes');
const projectRoutes = require('./routes/projectRoutes');
const projectTreeRoutes = require('./routes/projectTreeRoutes');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const { connectDatabase } = require('./config/database');

const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/adminRoutes');


const app = express();
const PORT = process.env.PORT || 8081;

app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', (req, res, next) => {
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
app.use('/api/banners', bannerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projecttree', projectTreeRoutes);
app.use('/api/blogs', blogRoutes);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {});
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
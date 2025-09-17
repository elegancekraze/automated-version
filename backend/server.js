import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes - using dynamic imports for CommonJS modules
import promptsRoutes from './src/routes/prompts.js';
import categoriesRoutes from './src/routes/categories.js';
import scrapeRoutes from './src/routes/scrape.js';
import statsRoutes from './src/routes/stats.js';
import { DatabaseService } from './src/services/database-service.js';
// const testRoutes = require('./src/routes/test');

const app = express();
const PORT = process.env.PORT || 3001;

// Global services
let database;
let scheduler;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      services: {
        api: 'healthy',
        database: 'unknown',
        scheduler: 'unknown'
      }
    };

    // Check database
    if (database) {
      const dbHealth = await database.healthCheck();
      health.services.database = dbHealth.connected ? 'healthy' : 'unhealthy';
    }

    // Check scheduler
    if (scheduler) {
      const schedulerStats = scheduler.getStats();
      health.services.scheduler = schedulerStats.is_running ? 'running' : 'idle';
    }

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// API Routes
app.use('/api/prompts', promptsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/stats', statsRoutes);
// app.use('/api/test', testRoutes); // Commented out - testRoutes not imported

// Serve static files from React build (in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Initialize services and start server
async function startServer() {
  try {
    console.log('Initializing GPT-5 Prompt Directory Backend...');
    
    // Initialize database
    console.log('Connecting to database...');
    database = new DatabaseService();
    await database.connect();
    
    // Make database available to routes
    app.locals.database = database;
    
    console.log('Database connected successfully');
    
    // Initialize scheduler (only in production or when enabled)
    if (process.env.ENABLE_SCHEDULER !== 'false') {
      console.log('Initializing scheduler...');
      scheduler = new SchedulerService();
      await scheduler.initialize();
      
      // Make scheduler available to routes
      app.locals.scheduler = scheduler;
      
      console.log('Scheduler initialized successfully');
    } else {
      console.log('Scheduler disabled by configuration');
    }
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 GPT-5 Prompt Directory Backend running on port ${PORT}`);
      console.log(`🔗 API available at: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 API endpoints:`);
      console.log(`   - GET /api/prompts - Get all prompts`);
      console.log(`   - GET /api/prompts/category/:category - Get prompts by category`);
      console.log(`   - GET /api/prompts/search?q=query - Search prompts`);
      console.log(`   - GET /api/categories - Get categories`);
      console.log(`   - GET /api/stats - Get statistics`);
      console.log(`   - POST /api/scrape/manual - Manual scraping (admin)`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully...');
      
      server.close(async () => {
        try {
          if (scheduler) {
            await scheduler.shutdown();
          }
          
          if (database) {
            await database.disconnect();
          }
          
          console.log('Server shut down successfully');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error.message);
          process.exit(1);
        }
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down gracefully...');
      
      server.close(async () => {
        try {
          if (scheduler) {
            await scheduler.shutdown();
          }
          
          if (database) {
            await database.disconnect();
          }
          
          console.log('Server shut down successfully');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error.message);
          process.exit(1);
        }
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;

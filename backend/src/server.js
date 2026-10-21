import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
// Support base64 image payloads up to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base / Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CampusCare - Smart Campus Complaint Management System',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` CampusCare Backend API running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to boot CampusCare Server:', err);
    process.exit(1);
  });

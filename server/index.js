import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import stadiumRoutes from './routes/stadiumRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import prisma from './lib/prismaClient.js';
import { startRatingCronJob } from './cron/ratingJob.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve Static Frontend in Production
// Assuming 'dist' is at the root level (one level up from 'server')
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all to serve frontend index.html for any non-API route
app.get('{*path}', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ message: 'API Route Not Found' });
  }
});

// Test DB connection
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Start background jobs
    startRatingCronJob();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

startServer();

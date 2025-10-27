
import dotenv from 'dotenv';
dotenv.config(); // Must be first

import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoute.js';
import useRouter from './routes/userRoutes.js';
import cloudinary from './configs/cloudinary.js'; 

// --- Verify environment variables ---
const requiredEnv = [
  'DATABASE_URL',
  'CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'GEMINI_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Environment variable ${key} is not set!`);
  }
});

// --- Debug output ---
console.log('✅ DATABASE_URL =', process.env.DATABASE_URL);
console.log('✅ CLERK_PUBLISHABLE_KEY =', process.env.CLERK_PUBLISHABLE_KEY);
console.log('✅ CLERK_SECRET_KEY =', process.env.CLERK_SECRET_KEY ? 'SET' : 'MISSING');
console.log('✅ GEMINI_API_KEY =', process.env.GEMINI_API_KEY);
console.log('✅ Cloudinary configured:', !!process.env.CLOUDINARY_CLOUD_NAME);

// --- Initialize Express app ---
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Must come before protected routes

// --- Public route ---
app.get('/', (req, res) => res.send('Server is running 🚀'));

// --- Protected routes ---
app.use('/api/ai', requireAuth(), aiRouter);
app.use('/api/user', requireAuth(), useRouter);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// --- Start server ---
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});



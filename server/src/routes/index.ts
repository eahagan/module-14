import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js'; // Import the authentication middleware

const router = Router();

// Public route for authentication (login)
router.use('/auth', authRoutes);

// Apply authentication middleware to all API routes
// This ensures all routes under `/api` are protected by JWT authentication
router.use('/api', authenticateToken, apiRoutes);

export default router;


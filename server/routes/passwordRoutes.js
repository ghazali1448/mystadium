import express from 'express';
import { requestReset, verifyToken, resetPassword } from '../controllers/passwordController.js';

const router = express.Router();

// Request a password reset
router.post('/request-reset', requestReset);

// Verify if a token is valid (for frontend check)
router.get('/verify-token/:token', verifyToken);

// Execute the password reset
router.post('/reset', resetPassword);

export default router;

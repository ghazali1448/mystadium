import express from 'express';
import { signup, login, updateProfile, updatePassword, updateLocation } from '../controllers/authController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/signup', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'ownershipDoc', maxCount: 1 }]), signup);
router.post('/login', login);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/location', updateLocation);

export default router;

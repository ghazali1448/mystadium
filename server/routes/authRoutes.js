import express from 'express';
import { signup, login, updateProfile, updatePassword, updateLocation } from '../controllers/authController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'server/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/signup', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'ownershipDoc', maxCount: 1 }]), signup);
router.post('/login', login);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/location', updateLocation);

export default router;

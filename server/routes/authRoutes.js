import express from 'express';
import { signup, login, updateProfile, updatePassword, updateLocation } from '../controllers/authController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Inject category into req.body before multer processes it
// so files go to the correct subdirectory
const setUploadCategory = (req, res, next) => {
  // Set default categories for signup files
  // multer reads req.body.category during storage destination
  req.body = req.body || {};
  req.body.category = req.body.category || 'stadiums';
  next();
};

router.post('/signup', setUploadCategory, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'ownershipDoc', maxCount: 1 }]), signup);
router.post('/login', login);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/location', updateLocation);

export default router;

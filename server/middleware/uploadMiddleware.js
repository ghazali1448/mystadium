import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUploadDir = path.join(__dirname, '../uploads');

// Create categorized subdirectories
const categories = ['stadiums', 'documents', 'avatars', 'general'];
categories.forEach(cat => {
  const dir = path.join(baseUploadDir, cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Storage engine that routes files into category subdirectories
 * based on the `category` field in the request body.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.category || req.query.category || 'general';
    const validCategory = categories.includes(category) ? category : 'general';
    cb(null, path.join(baseUploadDir, validCategory));
  },
  filename: (req, file, cb) => {
    // Sanitize original filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

/**
 * File filter: images and PDFs only
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed'));
};

// Single file upload (up to 5MB)
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Multi-file upload (up to 10 files, 5MB each)
export const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter
});

/**
 * Express error-handling middleware for Multer errors.
 * Mount this AFTER your upload routes.
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'File is too large. Maximum size is 5MB.',
      LIMIT_FILE_COUNT: 'Too many files. Maximum is 10.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected file field name.'
    };
    return res.status(400).json({
      message: messages[err.code] || `Upload error: ${err.message}`
    });
  }
  if (err?.message?.includes('Only images')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

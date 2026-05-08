import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { upload, uploadMultiple, handleMulterError } from '../middleware/uploadMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUploadDir = path.join(__dirname, '../uploads');

const router = express.Router();

/**
 * POST /api/upload
 * Upload a single file. Send `category` in body/query to organize into subdirectories.
 * Categories: stadiums | documents | avatars | general
 */
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const category = req.body.category || req.query.category || 'general';
  const fileUrl = `/uploads/${category}/${req.file.filename}`;

  res.status(200).json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    category
  });
});

/**
 * POST /api/upload/multiple
 * Upload multiple files (up to 10). Field name: "files"
 */
router.post('/multiple', uploadMultiple.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const category = req.body.category || req.query.category || 'general';

  const uploaded = req.files.map(file => ({
    url: `/uploads/${category}/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }));

  res.status(200).json({
    message: `${uploaded.length} file(s) uploaded successfully`,
    files: uploaded,
    category
  });
});

/**
 * DELETE /api/upload
 * Delete a file by its URL path. Body: { url: "/uploads/stadiums/filename.jpg" }
 */
router.delete('/', (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('/uploads/')) {
    return res.status(400).json({ message: 'Invalid file URL' });
  }

  // Prevent path traversal
  const normalizedUrl = path.normalize(url).replace(/^(\.\.(\/|\\|$))+/, '');
  if (normalizedUrl.includes('..')) {
    return res.status(400).json({ message: 'Invalid file path' });
  }

  const filePath = path.join(__dirname, '..', normalizedUrl);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

/**
 * GET /api/upload/list/:category
 * List all files in a category directory.
 */
router.get('/list/:category', (req, res) => {
  const { category } = req.params;
  const validCategories = ['stadiums', 'documents', 'avatars', 'general'];

  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  const dirPath = path.join(baseUploadDir, category);

  if (!fs.existsSync(dirPath)) {
    return res.status(200).json({ files: [] });
  }

  try {
    const files = fs.readdirSync(dirPath).map(filename => {
      const stat = fs.statSync(path.join(dirPath, filename));
      return {
        filename,
        url: `/uploads/${category}/${filename}`,
        size: stat.size,
        uploadedAt: stat.mtime
      };
    });

    res.status(200).json({ files, count: files.length });
  } catch (error) {
    res.status(500).json({ message: 'Error listing files', error: error.message });
  }
});

// Multer error handler — must come after routes
router.use(handleMulterError);

export default router;

import express from 'express';
import { getUserNotifications, markAsRead, createNotification } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getUserNotifications);
router.post('/', createNotification);
router.put('/:id/read', markAsRead);

export default router;

import prisma from '../lib/prismaClient.js';

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, relatedId } = req.body;
    const notification = await prisma.notification.create({
      data: { userId, type, title, message, relatedId }
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification read', error: error.message });
  }
};

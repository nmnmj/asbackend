import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

const buildNotificationService = (req: Request) => {
  const io = req.app.get('io');
  return new NotificationService(io);
};

export const getMyNotificationsHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const notificationService = buildNotificationService(req);

  const notifications =
    await notificationService.getUserNotifications(
      req.userId
    );

  res.status(200).json(notifications);
};

export const markNotificationAsReadHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.params;
  const notificationService = buildNotificationService(req);

  const notification =
    await notificationService.markAsRead(
      id,
      req.userId
    );

  res.status(200).json(notification);
};
import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getMyNotificationsHandler, markNotificationAsReadHandler } from './notification.controller';

const router = Router();

/**
 * GET /api/notifications
 * Fetch all notifications for logged-in user
 */
router.get(
  '/',
  authMiddleware,
  getMyNotificationsHandler
);

/**
 * PATCH /api/notifications/:id/read
 */
router.patch(
  '/:id/read',
  authMiddleware,
  markNotificationAsReadHandler
);

export default router;

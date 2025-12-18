import { NotificationRepository } from './notification.repository';

export class NotificationService {
  constructor(private readonly io: any) {}

  async notify(userId: string, message: string) {
    // ✅ Persist notification
    const notification = await NotificationRepository.create(
      userId,
      message
    );

    // ✅ Real-time delivery
    this.io
      .to(userId)
      .emit('notification:new', notification);

      console.log("notification")
      console.log(notification)

    return notification;
  }

  async getUserNotifications(userId: string) {
    return NotificationRepository.findForUser(userId);
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification =
      await NotificationRepository.markAsRead(
        notificationId,
        userId
      );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }
}

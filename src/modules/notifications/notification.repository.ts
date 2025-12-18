import { NotificationModel } from './notification.model';
import { Types } from 'mongoose';

export const NotificationRepository = {
  async create(userId: string, message: string) {
    return NotificationModel.create({
      userId: new Types.ObjectId(userId),
      message,
    });
  },

  async findForUser(userId: string) {
    return NotificationModel.find({
      userId: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
  },

   async markAsRead(notificationId: string, userId: string) {
    return NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        userId: new Types.ObjectId(userId), // 🔐 ownership check
      },
      { isRead: true },
      { new: true }
    );
  },
};

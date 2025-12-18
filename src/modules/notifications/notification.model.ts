import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: '1d', // 🔥 AUTO DELETE AFTER 24 HOURS
      },
    },
  },
  {
    timestamps: false, // we control createdAt manually
  }
);

export const NotificationModel = model<INotification>(
  'Notification',
  notificationSchema
);

import { TaskModel } from './task.model';

export const TaskRepository = {
  create: (data: any) => TaskModel.create(data),

  findById: (id: string) =>
    TaskModel.findById(id),

  findForUser: (userId: string) =>
    TaskModel.find({
      $or: [{ creatorId: userId }, { assignedToId: userId }],
    }),

  updateById: (id: string, data: any) =>
    TaskModel.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    TaskModel.findByIdAndDelete(id),
};

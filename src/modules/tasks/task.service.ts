import { Types } from 'mongoose';
import { TaskRepository } from './task.repository';
import {
  TaskPriority,
  TaskStatus,
  ITask,
} from './task.model';
import { NotificationService } from '../notifications/notification.service';

interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignedToId: string;
}

interface UpdateTaskPayload {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string;
}

export class TaskService {
  constructor(
    private readonly io: any,
    private readonly notificationService: NotificationService
  ) {}

  async createTask(
    creatorId: string,
    payload: CreateTaskPayload
  ) {
    const task = await TaskRepository.create({
      title: payload.title,
      description: payload.description,
      dueDate: new Date(payload.dueDate),
      priority: payload.priority,
      status: payload.status,
      creatorId: new Types.ObjectId(creatorId),
      assignedToId: new Types.ObjectId(payload.assignedToId),
    });

    // ✅ Persistent + real-time notification
    await this.notificationService.notify(
      payload.assignedToId,
      `You were assigned a task: ${payload.title}`
    );

    this.io.emit('task:created', task);

    return task;
  }

  async getTasksForUser(userId: string) {
    return TaskRepository.findForUser(userId);
  }

  async getTaskById(taskId: string) {
    return TaskRepository.findById(taskId);
  }

  async updateTask(
    taskId: string,
    userId: string,
    updates: UpdateTaskPayload
  ) {
    const task = await TaskRepository.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    if (
      task.creatorId.toString() !== userId &&
      task.assignedToId.toString() !== userId
    ) {
      throw new Error('Forbidden');
    }

    const dbUpdates: Partial<ITask> = {};

    if (updates.title !== undefined)
      dbUpdates.title = updates.title;

    if (updates.description !== undefined)
      dbUpdates.description = updates.description;

    if (updates.priority !== undefined)
      dbUpdates.priority = updates.priority;

    if (updates.status !== undefined)
      dbUpdates.status = updates.status;

    if (updates.dueDate !== undefined)
      dbUpdates.dueDate = new Date(updates.dueDate);

    if (updates.assignedToId !== undefined)
      dbUpdates.assignedToId = new Types.ObjectId(
        updates.assignedToId
      );

    const updatedTask = await TaskRepository.updateById(
      taskId,
      dbUpdates
    );

    // 🔥 Live update for all dashboards
    this.io.emit('task:updated', updatedTask);

    // 🔔 Assignment change notification
    if (
      updates.assignedToId &&
      updates.assignedToId !== task.assignedToId.toString()
    ) {
      await this.notificationService.notify(
        updates.assignedToId,
        `You were assigned a task: ${task.title}`
      );
    }

    return updatedTask;
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await TaskRepository.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.creatorId.toString() !== userId) {
      throw new Error('Only creator can delete task');
    }

    this.io.emit('task:deleted', task);

    return TaskRepository.deleteById(taskId);
  }
}

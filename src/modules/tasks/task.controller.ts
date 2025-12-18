import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { NotificationService } from '../notifications/notification.service';

const buildTaskService = (req: Request) => {
  const io = req.app.get('io');
  const notificationService = new NotificationService(io);
  return new TaskService(io, notificationService);
};

export const createTaskHandler = async (
  req: Request,
  res: Response
) => {
  const taskService = buildTaskService(req);

  const task = await taskService.createTask(
    req.userId!,
    req.body
  );

  res.status(201).json(task);
};

export const getMyTasksHandler = async (
  req: Request,
  res: Response
) => {
  const taskService = buildTaskService(req);

  const tasks = await taskService.getTasksForUser(req.userId!);
  res.status(200).json(tasks);
};

export const updateTaskHandler = async (
  req: Request,
  res: Response
) => {
  const taskService = buildTaskService(req);

  const updatedTask = await taskService.updateTask(
    req.params.id,
    req.userId!,
    req.body
  );

  res.status(200).json(updatedTask);
};

export const deleteTaskHandler = async (
  req: Request,
  res: Response
) => {
  const taskService = buildTaskService(req);

  await taskService.deleteTask(req.params.id, req.userId!);
  res.status(204).send();
};

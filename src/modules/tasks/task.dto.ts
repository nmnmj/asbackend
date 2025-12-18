import { z } from 'zod';
import { TaskPriority, TaskStatus } from './task.model';

export const CreateTaskDto = z.object({
  title: z.string().max(100),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string(),
});

export const UpdateTaskDto = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().optional(),
});

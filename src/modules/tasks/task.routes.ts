import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from './task.dto';
import {
  createTaskHandler,
  getMyTasksHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from './task.controller';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validate(CreateTaskDto),
  createTaskHandler
);

router.get(
  '/',
  authMiddleware,
  getMyTasksHandler
);

router.put(
  '/:id',
  authMiddleware,
  validate(UpdateTaskDto),
  updateTaskHandler
);

router.delete(
  '/:id',
  authMiddleware,
  deleteTaskHandler
);

export default router;

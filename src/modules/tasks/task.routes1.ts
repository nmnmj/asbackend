import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { CreateTaskDto } from './task.dto';
import { createTaskHandler, updateTaskHandler } from './task.controller';

const router = Router();

router.post('/', authMiddleware, validate(CreateTaskDto), createTaskHandler);
router.put('/:id', authMiddleware, updateTaskHandler);

export default router;

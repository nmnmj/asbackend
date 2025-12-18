import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { UpdateProfileDto } from './user.dto';

const router = Router();

router.get('/all', UserController.getUsers);
router.get('/me', authMiddleware, UserController.getProfile);
router.put(
  '/me',
  authMiddleware,
  validate(UpdateProfileDto),
  UserController.updateProfile
);

export default router;

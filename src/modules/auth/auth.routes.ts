import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { RegisterDto, LoginDto } from './auth.dto';

const router = Router();

router.post('/register', validate(RegisterDto), AuthController.register);
router.post('/login', validate(LoginDto), AuthController.login);
router.post('/logout', AuthController.logout);

export default router;

import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const { user, token } = await AuthService.register(
      name,
      email,
      password
    );

    res.status(201).json({
      user,
      token,
    });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { user, token } = await AuthService.login(
      email,
      password
    );

    res.status(200).json({
      user,
      token,
    });
  },

  logout: async (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'Logged out (client must discard token)',
    });
  },
};

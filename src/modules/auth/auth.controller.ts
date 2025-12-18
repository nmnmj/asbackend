import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export const AuthController = {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const { user, token } = await AuthService.register(name, email, password);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,  // set to true in production with https
        sameSite: 'lax', // none in production with https
      })
      .status(201)
      .json({ user });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .status(200)
      .json({ user });
  },

  logout: async (_req: Request, res: Response) => {
    res.clearCookie('token').status(200).json({ message: 'Logged out' });
  },
};

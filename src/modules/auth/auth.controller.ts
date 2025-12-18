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
        sameSite: 'none', // none in production with https lax for development
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/", 
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
        secure: false,  // set to true in production with https
        sameSite: 'none', // none in production with https
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/", 
      })
      .status(200)
      .json({ user });
  },

  logout: async (_req: Request, res: Response) => {
    res.clearCookie('token').status(200).json({ message: 'Logged out' });
  },
};

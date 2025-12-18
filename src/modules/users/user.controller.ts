import { Request, Response } from 'express';
import { UserService } from './user.service';

export const UserController = {
  getUsers: async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  },
  
  getProfile: async (req: Request, res: Response) => {
    const userId = req.userId!;
    const user = await UserService.getProfile(userId);

    res.status(200).json(user);
  },

  updateProfile: async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { name } = req.body;

    const updatedUser = await UserService.updateProfile(userId, name);

    res.status(200).json(updatedUser);
  },
};

import { UserRepository } from './user.repository';
import { hashPassword } from '../../utils/bcrypt';

export const UserService = {
  getAllUsers: async () => {
    return UserRepository.findAll();
  },
  
  createUser: async (name: string, email: string, password: string) => {
    const hashedPassword = await hashPassword(password);
    return UserRepository.create({
      name,
      email,
      password: hashedPassword,
    });
  },

  getProfile: async (userId: string) => {
    return UserRepository.findById(userId);
  },

  updateProfile: async (userId: string, name: string) => {
    return UserRepository.updateById(userId, { name });
  },
};

import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { comparePassword } from '../../utils/bcrypt';
import { signToken } from '../../utils/jwt';

export const AuthService = {
  register: async (name: string, email: string, password: string) => {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await UserService.createUser(name, email, password);
    const token = signToken({ userId: user._id.toString() });

    return { user, token };
  },

  login: async (email: string, password: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = signToken({ userId: user._id.toString() });
    return { user, token };
  },
};

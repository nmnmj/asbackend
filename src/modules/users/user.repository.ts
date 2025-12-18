import { UserModel, IUser } from './user.model';

export const UserRepository = {
  findAll: () => UserModel.find().select('-password'),
  
  create: (data: Partial<IUser>) => UserModel.create(data),

  findByEmail: (email: string) =>
    UserModel.findOne({ email }),

  findById: (id: string) =>
    UserModel.findById(id).select('-password'),

  updateById: (id: string, data: Partial<IUser>) =>
    UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select('-password'),
};

import { DataSource, Repository } from 'typeorm';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import logger from '../config/logger';

export interface UserServiceInterface {
  createUser: (userData: Partial<User>) => Promise<User>;
}

export const createUserService = (dataSource: DataSource): UserServiceInterface => {
  const userRepository: Repository<User> = dataSource.getRepository(User);

  const createUser = async (userData: Partial<User>): Promise<User> => {
    const { password = '', ...otherData } = userData;

    if (!password) {
      throw new Error('Password is required');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = userRepository.create({
        ...otherData,
        password: hashedPassword,
        roles: ['user'],
        isVerified: false,
      });

      logger.info(`User ${newUser.login} has been created`);
      return await userRepository.save(newUser);
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new Error('Could not create user');
    }
  };

  return {
    createUser,
  };
};

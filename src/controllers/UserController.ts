import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { createUserService, UserServiceInterface } from '../services/UserService';
import logger from '../config/logger';

interface RegisterUserRequest {
  login: string;
  email: string;
  password: string;
}

type UserResponse = Omit<User, 'password'>;

interface UserControllerInterface {
  registerUser: (
    req: Request<unknown, unknown, RegisterUserRequest>,
    res: Response,
  ) => Promise<void>;
}

export const createUserController = (dataSource: DataSource): UserControllerInterface => {
  const userService: UserServiceInterface = createUserService(dataSource);

  const registerUser = async (
    req: Request<unknown, unknown, RegisterUserRequest>,
    res: Response,
  ): Promise<void> => {
    const userData = req.body;

    try {
      const newUser = await userService.createUser(userData);

      // Create a new object without the password field
      const userResponse: UserResponse = Object.fromEntries(
        Object.entries(newUser).filter(([key]) => key !== 'password'),
      ) as UserResponse;

      logger.info(`User registered successfully: ${newUser.login}`);
      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
      });
    } catch (error) {
      handleRegistrationError(error, res);
    }
  };

  const handleRegistrationError = (error: unknown, res: Response): void => {
    if (error instanceof Error) {
      switch (error.message) {
        case 'Password is required':
          logger.warn('Registration attempt with missing password');
          res.status(400).json({ message: 'Password is required' });
          break;
        case 'Could not create user':
          logger.error('Failed to create user in database', { error });
          res.status(500).json({ message: 'Error creating user' });
          break;
        default:
          logger.error('Unexpected error during user registration', { error });
          res.status(500).json({ message: 'An unexpected error occurred' });
      }
    } else {
      logger.error('Unknown error during user registration', { error });
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  };

  return {
    registerUser,
  };
};

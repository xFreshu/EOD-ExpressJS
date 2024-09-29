import { Router } from 'express';
import { DataSource } from 'typeorm';
import { createUserController } from '../controllers/UserController';

export const createUserRouter = (dataSource: DataSource): Router => {
  const router = Router();
  const userController = createUserController(dataSource);

  // POST methods
  router.post('/register', userController.registerUser);

  return router;
};

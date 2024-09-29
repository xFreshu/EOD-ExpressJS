import express from 'express';
import { AppDataSource } from './config/data-source';
import dotenv from 'dotenv';
import logger from './config/logger';
import { createUserRouter } from './routes/UserRoute';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    logger.info('Data Source has been initialized!');

    const userRouter = createUserRouter(AppDataSource);
    app.use('/api/users', userRouter);

    app.use((req, res) => {
      res.status(404).json({ message: 'Not Found' });
    });

    // Globalny middleware do obsługi błędów
    app.use((err: Error, req: express.Request, res: express.Response) => {
      logger.error(err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
  });

export default app;

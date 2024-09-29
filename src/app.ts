import express from 'express';
import { AppDataSource } from './config/data-source';
import dotenv from 'dotenv';
import logger from './config/logger';

dotenv.config();

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization', error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  logger.info('App is running');
  res.send('Hello World!');
});

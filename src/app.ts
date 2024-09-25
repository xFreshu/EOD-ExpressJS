import express from 'express';
import { createConnection } from 'typeorm';


const app = express();

// Middleware
app.use(express.json());

// Routes
//app.use('/api', exampleRoutes);

// Error handling
//app.use(errorHandler);

// Database connection
/*
createConnection()
  .then(() => console.log('Connected to database'))
  .catch((error) => console.log('Database connection error:', error));
*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

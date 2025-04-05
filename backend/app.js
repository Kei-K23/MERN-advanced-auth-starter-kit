import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import cookieParser from 'cookie-parser';
import NotFoundError from './exceptions/NotFoundError.js';
import router from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/health-check', (_req, res) => {
  res.json({ message: 'hello world' });
});

// Register routes
app.use('/api/v1', router);

// 404 handler
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;

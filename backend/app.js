import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import cookieParser from 'cookie-parser';
import NotFoundError from './exceptions/NotFoundError.js';
import router from './routes/index.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.get('/api/v1/health-check', (_req, res) => {
  res.json({ success: true });
});

// Register routes
app.use('/api/v1', router);

// 404 handler
app.use((_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export default app;

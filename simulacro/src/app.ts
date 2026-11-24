import express from 'express';
import type { Application } from 'express';
import { healthRouter } from './routes/health.js';
import { documentsRouter } from './routes/documents.js';
import { noticesRouter } from './routes/notices.js';
import { questionsRouter } from './routes/questions.js';
import { articlesRouter } from './routes/articles.js';
import { requestId } from './middlewares/requestId.js';
import { logger } from './middlewares/logger.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
export function createApp(): Application {
  const app = express();
  app.use(requestId);
  if (process.env.LOG !== 'OFF') {
  app.use(logger);
}
  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/api/v1/admin/documents', documentsRouter);
  app.use('/api/v1/questions', questionsRouter);
  app.use('/api/v1/articles', articlesRouter);
  app.use('/api/v1/notices', noticesRouter);
  
  app.get('/test/:nombreEquipo', (req, res) => {
    const { nombreEquipo } = req.params;
    res.status(200).json({ team: nombreEquipo });
  });

  app.get('/echo', (req, res) => {
    res.json({ method: req.method, path: req.path, query: req.query });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (req, res) => {
  console.log(req.method, req.originalUrl); // TEMPORAL: se quita al final
  res.status(200).json({ status: 'live' }); // TEMPORAL: volver a 200
});

healthRouter.get('/ready', (_req, res) => {
  res.status(200).json({ status: 'ready' });
});

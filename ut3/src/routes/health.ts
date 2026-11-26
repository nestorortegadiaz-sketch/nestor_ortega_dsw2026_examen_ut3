// GET /health/live — creado en el tema 03 y mantenido igual en los temas posteriores.
// El cuerpo de la respuesta es EXACTAMENTE { "status": "live" }; no incluye otros campos.

import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'live' });
});

import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { AppErrorDescription } from '../errors/AppErrorDescription.js';

// Express reconoce un gestor de errores porque tiene CUATRO parámetros.
// `_next` nunca se utiliza, pero debe existir: con tres parámetros Express
// trataría esta función como un middleware normal y nunca le entregaría errores.
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isProduction = env.NODE_ENV === 'production';

  console.log('[errorHandler]', req.requestId, err.message);

  console.error(
    JSON.stringify({
      requestId: req.requestId,
      error: err.message,
      stack: isProduction ? undefined : err.stack,
    }),
  );

  // Errores esperados: lanzados deliberadamente por nuestro código (400, 404...).
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.code ?? 'ERROR', message: err.message });
    return;
  }
  if (err instanceof AppErrorDescription) {
    res.status(400).json({ error: err.code ?? 'INVALID_DESCRIPTION', message: 'Description must not contain ERROR' });
    return;
  }

  // express.json() lanza un SyntaxError cuando el cuerpo no contiene JSON válido.
  // Es un error del cliente, por lo que corresponde un 400 y no un 500.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'INVALID_JSON', message: 'Request body is not valid JSON' });
    return;
  }

  // Cualquier otro caso es inesperado: 500, sin mostrar detalles internos en producción.
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: isProduction ? 'An unexpected error occurred' : err.message,
  });
}

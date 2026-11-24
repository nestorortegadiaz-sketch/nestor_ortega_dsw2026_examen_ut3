import { Router } from 'express';
import * as noticesController from '../controllers/noticesController.js';

// Creamos el router de avisos.
export const noticesRouter = Router();

// GET: obtener todos los avisos.
noticesRouter.get('/', noticesController.list);

// GET: obtener un aviso por su ID.
noticesRouter.get('/:noticeId', noticesController.getById);

// POST: crear un aviso nuevo.
noticesRouter.post('/', noticesController.create);

// PATCH: modificar un aviso existente.
noticesRouter.patch('/:noticeId', noticesController.update);

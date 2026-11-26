// Capa de rutas: solo relaciona método y ruta con una función del controlador.
// Las mismas URL que el router del tema 04; ahora la lógica está en el controlador
// (HTTP) y en el servicio (datos).

import { Router } from 'express';

import * as articlesController from '../controllers/articlesController.js';

export const articlesRouter = Router();

// GET /api/v1/articles: lista los artículos con paginación.
articlesRouter.get('/', articlesController.list);

// POST /api/v1/articles: crea un artículo.
articlesRouter.post('/', articlesController.create);

// GET /api/v1/articles/:articleId: obtiene un artículo por su identificador.
articlesRouter.get('/:articleId', articlesController.getById);

// PATCH /api/v1/articles/:articleId: actualiza parcialmente un artículo.
articlesRouter.patch('/:articleId', articlesController.update);

// Capa de controladores: lee req, valida manualmente los datos, llama al servicio
// y devuelve la respuesta. Los errores se lanzan como AppError y se entregan al
// errorHandler central mediante next(err).
import { AppError } from '../errors/AppError.js';
import * as articlesService from '../services/articlesService.js';
import { AppErrorDescription } from '../errors/AppErrorDescription.js';
import { articles } from '../services/articlesService.js';
// GET: lee la paginación de la consulta y devuelve la lista de artículos.
export function list(req, res, next) {
    try {
        // req.query siempre llega como texto: el controlador lo convierte.
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 20);
        const sinDescripcion = Number(req.query.limit ?? 1);
        if (sinDescripcion == 1) {
            const filteredArticles = articles.filter((articles) => articles.title === 'Sin descripcion');
        }
        res.json(articlesService.list(page, limit, sinDescripcion));
    }
    catch (err) {
        next(err);
    }
}
// GET: busca un artículo por ID y devuelve 404 si no existe.
export function getById(req, res, next) {
    try {
        const article = articlesService.getById(String(req.params.articleId));
        if (!article) {
            throw new AppError(404, `Article with id '${req.params.articleId}' not found`, 'NOT_FOUND');
        }
        res.json({ data: article });
    }
    catch (err) {
        next(err);
    }
}
// POST: valida los datos recibidos y crea un artículo con respuesta 201.
export function create(req, res, next) {
    console.log('[4] articlesController.create', req.requestId);
    try {
        const { title, description } = req.body;
        if (!title || typeof title !== 'string') {
            throw new AppError(400, 'Missing required field: title', 'BAD_REQUEST');
        }
        const article = articlesService.create(title.trim(), typeof description === 'string' ? description.trim() : '');
        if (description == "ERROR") {
            throw new AppErrorDescription(400, 'INVALID_DESCRIPTION', 'Description must not contain ERROR');
        }
        // Comprobar si la descripcion es valida
        if (typeof description !== undefined) {
            description == "Error";
        }
        console.log('[5] Respuesta preparada: 201', req.requestId, { data: article });
        res.status(201).json({ data: article });
    }
    catch (err) {
        next(err);
    }
}
// PATCH: aplica los cambios enviados y devuelve 404 si el artículo no existe.
export function update(req, res, next) {
    try {
        const { title, description } = req.body;
        const article = articlesService.update(String(req.params.articleId), { title, description });
        if (!article) {
            throw new AppError(404, `Article with id '${req.params.articleId}' not found`, 'NOT_FOUND');
        }
        res.json({ data: article });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=articlesController.js.map
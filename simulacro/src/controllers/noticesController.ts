import type { Request, Response } from 'express';
import * as noticesService from '../services/noticesService.js';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

// GET /api/v1/notices?page=1&limit=20&search=matrícula
export function list(req: Request, res: Response): void {

    // Recogemos los parámetros de la URL.
    // Si no se envían, utilizamos los valores predeterminados.
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = req.query.search ? String(req.query.search) : undefined;

    // Llamamos al servicio para obtener los avisos.
    const { data, total } = noticesService.list(page, limit, search);

    // Devolvemos los avisos y la información de paginación.
    res.json({
        data,
        pagination: { page, limit, total },
    });
}

// GET /api/v1/notices/:noticeId
export function getById(req: Request, res: Response): void {

    // Recogemos el identificador que viene en la URL.
    const noticeId = String(req.params.noticeId);

    // Buscamos el aviso utilizando el servicio.
    const notice = noticesService.getById(noticeId);

    // Si no existe, lanzamos un error 404.
    if (!notice) {
        throw new ResourceNotFoundError(
            404,
            'RESOURCE_NOT_FOUND',
            noticeId,
        );
    }

    // Si existe, devolvemos el aviso.
    res.json({ data: notice });
}

// POST /api/v1/notices
export function create(req: Request, res: Response): void {

  // Recogemos los datos enviados en el body.
  const { title, description } = req.body;

  // Comprobamos que el título sea una cadena no vacía.
  if (typeof title !== 'string' || title.trim() === '') {
    throw new AppError(400, 'Title is required', 'INVALID_TITLE');
  }

  // Comprobamos que la descripción sea una cadena.
  if (typeof description !== 'string') {
    throw new AppError(400, 'Description is required', 'INVALID_DESCRIPTION');
  }

  // Llamamos al servicio para crear el aviso.
  const notice = noticesService.create(title, description);

  // Respondemos con estado 201 porque hemos creado un recurso.
  res.status(201).json({ data: notice });
}

// PATCH /api/v1/notices/:noticeId
export function update(req: Request, res: Response): void {

  // Recogemos los datos que queremos modificar.
  const { title, description } = req.body;

  // Si se envía title, comprobamos que sea una cadena no vacía.
  if (
    title !== undefined &&
    (typeof title !== 'string' || title.trim() === '')
  ) {
    throw new AppError(400, 'Title must be a non-empty string', 'INVALID_TITLE');
  }

  // Si se envía description, comprobamos que sea una cadena.
  if (
    description !== undefined &&
    typeof description !== 'string'
  ) {
    throw new AppError(400, 'Description must be a string', 'INVALID_DESCRIPTION');
  }

  // Llamamos al servicio para modificar el aviso.
  const notice = noticesService.update(
    String(req.params.noticeId),
    title,
    description,
  );

  // Si no existe el aviso, respondemos con un error 404.
  if (!notice) {
    throw new ResourceNotFoundError(
      404,
      'RESOURCE_NOT_FOUND',
      String(req.params.noticeId),
    );
  }

  // Devolvemos el aviso actualizado.
  res.json({ data: notice });
}
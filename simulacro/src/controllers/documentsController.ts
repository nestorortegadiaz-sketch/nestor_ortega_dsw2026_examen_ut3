import type { Request, Response } from 'express';
import * as documentsService from '../services/documentsService.js';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

// GET /api/v1/admin/documents?page=1&limit=20
export function list(req: Request, res: Response): void {
  // req.query SIEMPRE llega como texto: "2", no 2. Hay que convertirlo.
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const { data, total } = documentsService.list(page, limit);

  res.json({ data, pagination: { page, limit, total } });
}

// GET /api/v1/admin/documents/:documentId
export function getById(req: Request, res: Response): void {
  const document = documentsService.getById(String(req.params.documentId));

  // if (!document) {
  //   throw new AppError(404, 'Document not found', 'NOT_FOUND');
  // }

  if (!document) {
    throw new ResourceNotFoundError(404, 'RESOURCE_NOT_FOUND', String(req.params.documentId));
  }

  res.json({ data: document });
}

// POST /api/v1/admin/documents
export function create(req: Request, res: Response): void {
  const { title, description } = req.body;

  if (!title) {
    throw new AppError(400, 'Title is required', 'MISSING_TITLE');
  }

  const document = documentsService.create(title, description);
  res.status(201).json({ data: document });
}

// PATCH /api/v1/admin/documents/:documentId
export function update(req: Request, res: Response): void {
  const { title, description } = req.body;

  // Comprobar si el título es inválido
  if (
    title !== undefined &&
    (typeof title !== 'string' || title.trim() === '')
  ) {
    res.status(400).json({
      error: 'INVALID_TITLE',
      message: 'Title must be a non-empty string',
    });
    return;
  }

  // Si el título es válido, continuar con la actualización
  const document = documentsService.update(
    String(req.params.documentId),
    title,
    description,
  );

  if (!document) {
    throw new AppError(404, 'Document not found', 'DOCUMENT_NOT_FOUND');
  }

  res.json({ data: document });
}
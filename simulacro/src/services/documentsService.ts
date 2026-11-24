import { randomUUID } from 'node:crypto';

interface Document {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Datos en memoria: se pierden cada vez que el servidor se reinicia.
const documents: Document[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Guía pública del centro',
    description: '',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Normas de convivencia',
    description: '',
    createdAt: '2026-09-01T08:00:00.000Z',
  },
];

// GET /api/v1/admin/documents?page=1&limit=20
export function list(page: number, limit: number) {
  const start = (page - 1) * limit;

  return {
    data: documents.slice(start, start + limit),
    total: documents.length,
  };
}

// POST /api/v1/admin/documents

export function create(title: string, description?: string) {
  const document: Document = {
    id: randomUUID(),
    title,
    description: description ?? '',
    createdAt: new Date().toISOString(),
  };
  documents.push(document);
  return document;
}

// GET /api/v1/admin/documents/:documentId
export function getById(documentId: string) {
  const document = documents.find((doc) => doc.id === documentId);
  return document;
}

// PATCH /api/v1/admin/documents/:documentId
export function update(documentId: string, title?: string, description?: string) {
  const document = documents.find((doc) => doc.id === documentId);

  if (!document) {
    return undefined;
  }

  if (title) {
    document.title = title;
  }
  if (description !== undefined) {
    document.description = description;
  }
  return document;
}

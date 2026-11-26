// Capa de servicios: lógica de negocio y datos. Es TypeScript puro: nunca
// importa Express ni utiliza req/res/next, por lo que puede probarse sin HTTP.

import { randomUUID } from 'node:crypto';

export interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface ArticleChanges {
  title?: string;
  description?: string;
}

// Ahora el array en memoria reside aquí, no en las rutas.
export const articles: Article[] = [];

// Devuelve una página de artículos y los datos de paginación.
export function list(page: number, limit: number, sinDescripcion: number) {
  const start = (page - 1) * limit;
  return {
    data: articles.slice(start, start + limit),
    pagination: { page, limit, total: articles.length },
  };
}

// Busca un artículo por su ID; devuelve undefined si no lo encuentra.
export function getById(id: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

// Crea un artículo con un ID y una fecha de creación nuevos.
export function create(title: string, description?: string): Article {
  const article: Article = {
    id: randomUUID(),
    title,
    description :"",
    createdAt: new Date().toISOString(),
  };
  articles.push(article);
  return article;
}

// Actualiza solo los campos recibidos; devuelve undefined si no existe.
export function update(id: string, changes: ArticleChanges): Article | undefined {
  const article = getById(id);
  if (!article) {
    return undefined;
  }
  if (changes.title !== undefined) {
    article.title = changes.title;
  }
  if (changes.description !== undefined) {
    article.description = changes.description;
  }
  return article;
}

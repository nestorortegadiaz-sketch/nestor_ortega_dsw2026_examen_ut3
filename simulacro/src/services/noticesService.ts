
import { randomUUID } from 'node:crypto';
import { AppError } from '../errors/AppError.js';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError.js';

// Interfaz que define la estructura que debe tener cada aviso.
interface Notice {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

// Array independiente donde almacenamos los avisos en memoria.
// Los datos se pierden cuando se reinicia el servidor.
const notices: Notice[] = [
    {
        id: '11111111-1111-4111-8111-111111111111',
        title: 'Aviso de matrícula',
        description: 'Abierto el plazo de matrícula del nuevo curso.',
        createdAt: '2026-09-01T08:00:00.000Z',
    },
    {
        id: '22222222-2222-4222-8222-222222222222',
        title: 'Aviso de reunión',
        description: 'Reunión informativa para las familias.',
        createdAt: '2026-09-02T08:00:00.000Z',
    },
    {
        id: '33333333-3333-4333-8333-333333333333',
        title: 'Aviso de excursión',
        description: 'Información sobre la excursión del alumnado.',
        createdAt: '2026-09-03T08:00:00.000Z',
    },
    {
        id: '44444444-4444-4444-8444-444444444444',
        title: 'Aviso de matrícula extraordinaria',
        description: 'Nuevo plazo para realizar la matrícula.',
        createdAt: '2026-09-04T08:00:00.000Z',
    },
    {
        id: '55555555-5555-4555-8555-555555555555',
        title: 'Aviso de actividades',
        description: 'Calendario de actividades del centro.',
        createdAt: '2026-09-05T08:00:00.000Z',
    },
];

// GET /api/v1/notices
// Devuelve los avisos aplicando paginación y un filtro de búsqueda opcional.
export function list(page: number, limit: number, search?: string) {
    // page y limit deben ser números enteros mayores que cero. 
    // En caso contrario, responde 400 mediante un AppError.

    if (
        !Number.isInteger(page) ||
        page <= 0 ||
        !Number.isInteger(limit) ||
        limit <= 0
    ) {
        throw new AppError(
            400,
            'Page and limit must be positive integers',
            'INVALID_PAGINATION'
        );
    }

    // Si recibimos una palabra de búsqueda, filtramos los avisos
    // cuyo título contenga esa palabra.
    // toLowerCase() permite buscar sin distinguir mayúsculas y minúsculas.
    const filteredNotices = search
        ? notices.filter((notice) =>
            notice.title.toLowerCase().includes(search.toLowerCase())
        )
        : notices;

    // Calculamos desde qué posición del array debemos empezar a mostrar los avisos.
    const start = (page - 1) * limit;

    // Devolvemos los avisos correspondientes a la página solicitada
    // y el número total de resultados después de aplicar el filtro.
    return {
        data: filteredNotices.slice(start, start + limit),
        total: filteredNotices.length,
    };
}

// GET /api/v1/notices/:noticeId
// Busca un aviso por su identificador.
export function getById(noticeId: string) {

    const notice = notices.find((item) => item.id === noticeId);

    // Si no existe, lanzamos un error 404.
    if (!notice) {
        throw new ResourceNotFoundError(
            404,
            'Notice not found',
            'RESOURCE_NOT_FOUND',
            noticeId
        );
    }

    return notice;
}

// POST /api/v1/notices
// Crea un aviso nuevo.
export function create(title: string, description?: string) {

    // Comprobamos que el titulo sea una cadena y no este vacio.
    if (typeof title !== "string" || title.trim() === "") {
        throw new AppError(400, 'Title is required', 'MISSING_TITLE');
    }

    // Si no se envia descripcion, guardamos una cadena vacia.
    if (description === undefined) {
        description = "";
    }

    // Comprobamos que la descripcion sea una cadena.
    if (typeof description !== "string") {
        throw new AppError(400, 'Description must be a string', 'INVALID_DESCRIPTION');
    }

    // Creamos el aviso despues de validar los datos.
    const notice: Notice = {
        id: randomUUID(),
        title: title.trim(),
        description: description,
        createdAt: new Date().toISOString(),
    };

    // Guardamos el aviso.
    notices.push(notice);

    // Devolvemos el aviso creado.
    return notice;
}

// PATCH /api/v1/notices/:noticeId
// Modifica parcialmente un aviso existente.
export function update(
    noticeId: string,
    title?: string,
    description?: string,
) {

    // Buscamos el aviso por su identificador.
    const notice = notices.find((item) => item.id === noticeId);

    // Si no existe, lanzamos un error.
    if (!notice) {
        throw new ResourceNotFoundError(
            404,
            'Notice not found',
            'RESOURCE_NOT_FOUND',
            noticeId
        );
    }

    // Validamos el titulo si se ha enviado.
    if (title !== undefined) {

        if (typeof title !== "string" || title.trim() === "") {
            throw new AppError(400, 'Title is required', 'MISSING_TITLE');
        }

    }

    // Validamos la descripcion si se ha enviado.
    if (description !== undefined) {

        if (typeof description !== "string") {
            throw new AppError(400, 'Description must be a string', 'INVALID_DESCRIPTION');
        }

    }

    // Actualizamos el titulo solamente si se ha enviado.
    if (title !== undefined) {
        notice.title = title.trim();
    }

    // Actualizamos la descripcion solamente si se ha enviado.
    if (description !== undefined) {
        notice.description = description;
    }

    // Devolvemos el aviso actualizado.
    return notice;
}

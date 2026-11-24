
import { randomUUID } from 'node:crypto';

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

    // find() devuelve el aviso cuyo id coincide con noticeId.
    // Si no encuentra ninguno, devuelve undefined.
    const notice = notices.find((item) => item.id === noticeId);

    return notice;
}

// POST /api/v1/notices
// Crea un aviso nuevo.
export function create(title: string, description: string) {

    // Creamos un objeto Notice con sus cuatro propiedades.
    // randomUUID() genera un identificador único.
    // new Date().toISOString() genera la fecha actual en formato ISO.
    const notice: Notice = {
        id: randomUUID(),
        title,
        description,
        createdAt: new Date().toISOString(),
    };

    // Añadimos el nuevo aviso al array.
    notices.push(notice);

    // Devolvemos el aviso que acabamos de crear.
    return notice;
}

// PATCH /api/v1/notices/:noticeId
// Modifica parcialmente un aviso existente.
export function update(
    noticeId: string,
    title?: string,
    description?: string,
) {

    // Buscamos el aviso que queremos modificar.
    const notice = notices.find((item) => item.id === noticeId);

    // Si el aviso no existe, devolvemos undefined.
    if (!notice) {
        return undefined;
    }

    // Si recibimos un título, actualizamos el título anterior.
    // Si no lo recibimos, conservamos el que ya tenía.
    if (title !== undefined) {
        notice.title = title;
    }

    // Si recibimos una descripción, actualizamos la anterior.
    // Si no la recibimos, conservamos la que ya tenía.
    if (description !== undefined) {
        notice.description = description;
    }

    // Devolvemos el aviso con los cambios realizados.
    return notice;
}

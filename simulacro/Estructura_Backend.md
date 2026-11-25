# Estructura y organización del backend

## 1. Estructura de carpetas y archivos

El proyecto está organizado siguiendo una arquitectura por capas, separando las responsabilidades para facilitar el mantenimiento, la comprensión y la ampliación del backend.

```text
TeamAtunRojo/
│
├── src/
│   │
│   ├── server.ts
│   ├── app.ts
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── routes/
│   │   ├── health.ts
│   │   └── notices.ts
│   │
│   ├── controllers/
│   │   └── noticesController.ts
│   │
│   ├── services/
│   │   └── noticesService.ts
│   │
│   ├── middlewares/
│   │   ├── requestId.ts
│   │   ├── logger.ts
│   │   ├── notFound.ts
│   │   └── errorHandler.ts
│   │
│   └── errors/
│       ├── AppError.ts
│       └── ResourceNotFoundError.ts
│
├── simulacro/
│   └── RESPUESTAS.md
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 2. Función de cada archivo y carpeta

| Archivo o carpeta | Función |
|---|---|
| `server.ts` | Arranca el servidor y hace que escuche en el puerto configurado. |
| `app.ts` | Configura Express y conecta las rutas y los middlewares. |
| `config/env.ts` | Lee y valida las variables de entorno. |
| `routes/` | Define las direcciones o endpoints de la API. |
| `controllers/` | Recibe las peticiones y prepara las respuestas. |
| `services/` | Contiene la lógica y las operaciones de la aplicación. |
| `middlewares/` | Ejecuta tareas intermedias, como logs y gestión de errores. |
| `errors/` | Contiene las clases de errores personalizados. |

## 3. Orden de funcionamiento de una petición

Por ejemplo, cuando un cliente realiza una petición:

```http
GET /api/v1/notices
```

El funcionamiento general es el siguiente:

1. **server.ts:** arranca el servidor.
2. **app.ts:** configura Express y conecta los middlewares y las rutas.
3. **middlewares/:** ejecuta tareas intermedias, como identificar la petición y registrar información en el logger.
4. **routes/notices.ts:** reconoce la dirección solicitada y dirige la petición al controlador correspondiente.
5. **controllers/noticesController.ts:** recibe la petición y recoge los parámetros necesarios.
6. **services/noticesService.ts:** ejecuta la lógica necesaria para obtener los datos.
7. **Controller:** recibe el resultado del servicio y devuelve la respuesta al cliente.

Si durante el proceso se produce un error, se utiliza el sistema de gestión de errores, que termina llegando al middleware `errorHandler.ts`.

## 4. Diferencia entre Routes, Controllers, Services y Middlewares

- **Routes:** indican a qué dirección está llegando la petición y qué controlador debe ejecutarse.
- **Controllers:** gestionan la petición recibida y preparan la respuesta HTTP.
- **Services:** contienen la lógica de funcionamiento de la aplicación.
- **Middlewares:** ejecutan procesos intermedios antes de llegar al controlador o durante la gestión de errores.

## 5. Diferencia entre app.ts y server.ts

Aunque ambos archivos están relacionados con Express, tienen funciones diferentes:

- **app.ts:** configura la aplicación Express. Aquí se registran los middlewares y las rutas.
- **server.ts:** importa la aplicación y arranca el servidor mediante `listen()`, utilizando el puerto configurado.

Esta separación permite tener por un lado la configuración de la aplicación y por otro su puesta en funcionamiento.

## 6. Resumen

La arquitectura por capas permite organizar el backend de forma clara:

- Las rutas reciben las peticiones.
- Los controladores gestionan las peticiones y respuestas.
- Los servicios ejecutan la lógica de negocio.
- Los middlewares realizan tareas comunes.
- Los errores personalizados permiten gestionar los problemas de forma organizada.
- `app.ts` configura Express y `server.ts` arranca el servidor.

Separar estas responsabilidades facilita encontrar errores, modificar funcionalidades y ampliar el proyecto sin tener todo el código mezclado en un único archivo.
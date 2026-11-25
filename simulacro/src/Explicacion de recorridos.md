# 11. Explica el recorrido de las peticiones

## Recorrido de las peticiones

Se distingue la entrada al logger, donde se registra el callback de `finish` y se llama a `next()`, de la ejecución posterior de dicho callback, cuando termina la respuesta.

### 1. Consulta de un documento existente

`requestId → logger (entrada) → express.json() → documentsRouter → documentsController.getById() → documentsService.getById() → respuesta → logger (finish)`.

El servicio encuentra el documento y el controlador genera la respuesta mediante `res.json({ data: document })`. Devuelve **200 OK**. No se ejecutan `notFound` ni `errorHandler`.

### 2. Consulta de un documento inexistente

`requestId → logger (entrada) → express.json() → documentsRouter → documentsController.getById() → documentsService.getById() → throw → catch → next(err) → errorHandler → respuesta → logger (finish)`.

El controlador detecta que el documento no existe y ejecuta:

```typescript
throw new AppError(404, 'Document not found', 'NOT_FOUND');
```

El manejador de errores genera la respuesta **404 Not Found**. Sí se ejecuta `errorHandler`, pero no `notFound`. En el controlador facilitado, la segunda comprobación de `!document`, que utiliza `ResourceNotFoundError`, es inalcanzable porque la primera ya lanza una excepción.

### 3. Petición a una URL que no existe

`requestId → logger (entrada) → express.json() → ningún router coincide → notFound → respuesta → logger (finish)`.

El middleware `notFound` genera directamente la respuesta **404 Not Found**. No se ejecuta `errorHandler` si `notFound` responde directamente.

### 4. Creación de un aviso con JSON bien formado, pero título inválido

`requestId → logger (entrada) → express.json() → router de avisos → controlador de avisos → validación → next(err) → errorHandler → respuesta → logger (finish)`.

El JSON se procesa correctamente, pero el título no supera la validación. Si el controlador lanza un `AppError` y lo delega mediante `next(err)`, el manejador de errores genera una respuesta **400 Bad Request**. En ese caso sí se ejecuta `errorHandler` y no se crea el aviso.

### 5. Petición con un cuerpo JSON mal formado

`requestId → logger (entrada) → express.json() → error de análisis → errorHandler → respuesta → logger (finish)`.

El middleware `express.json()` detecta el error de sintaxis y lo delega al manejador de errores. No se ejecutan el router, el controlador ni el servicio. Sí se ejecuta `errorHandler`. El estado esperado es **400 Bad Request**, siempre que el manejador respete el estado del error de análisis.

### 6. Actualización de un documento con un título vacío

`requestId → logger (entrada) → express.json() → documentsRouter → documentsController.update() → validación → respuesta directa → logger (finish)`.

El controlador responde directamente:

```typescript
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
```

Devuelve **400 Bad Request**. No se ejecutan `errorHandler`, `notFound` ni el servicio de actualización. El `return` evita continuar con la ejecución del controlador.

## Resumen

| Petición | Estado esperado | Genera la respuesta | errorHandler |
| --- | --- | --- | --- |
| Documento existente | 200 | Controlador | No |
| Documento inexistente | 404 | errorHandler | Sí |
| URL inexistente | 404 | notFound | No |
| Aviso con título inválido | 400* | errorHandler* | Sí* |
| JSON mal formado | 400* | errorHandler | Sí |
| Actualización con título vacío | 400 | Controlador | No |

\* Depende de la implementación concreta.

## Preguntas teóricas

### ¿Por qué este `notFound` no llama a `next()`?

Porque es un middleware terminal que envía directamente una respuesta con estado 404. No necesita continuar la cadena y hacerlo podría provocar un segundo intento de enviar una respuesta.

### Cuando un controlador llama a `next(err)`, ¿por qué no se ejecuta el `notFound` que está registrado a continuación?

Porque Express entra en el flujo de gestión de errores y omite los middlewares normales hasta encontrar un middleware de errores. Por ello se salta `notFound` y ejecuta `errorHandler`.

### ¿Por qué el manejador de errores necesita cuatro parámetros aunque no use el último?

Express identifica los middlewares de errores mediante su firma de cuatro parámetros:

```typescript
function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  // Gestión del error
}
```

Aunque no se utilice `next`, debe estar presente para que Express reconozca la función como un manejador de errores.

### ¿Qué diferencia hay entre una ruta inexistente y un recurso inexistente?

Una ruta inexistente significa que la URL y el método no coinciden con ninguna ruta registrada. La gestiona `notFound`. Un recurso inexistente significa que la ruta existe, pero el servicio no encuentra el elemento solicitado. El controlador puede lanzar un error que gestiona `errorHandler`. Ambos casos pueden devolver 404, pero tienen un origen diferente.

### ¿Por qué el logger utiliza el evento `finish` para registrar el estado de la respuesta?

Al entrar en el logger todavía no se conoce necesariamente el estado HTTP definitivo. Se registra un callback y se llama a `next()` para continuar el procesamiento. Cuando se emite `finish`, el estado de la respuesta ya está determinado y puede registrarse junto con la duración de la petición, si está implementada.

```typescript
res.on('finish', () => {
  console.log(req.method, req.originalUrl, res.statusCode);
});
next();
```

El evento indica que Node.js ha entregado los datos de respuesta al sistema operativo para su transmisión, no que el cliente necesariamente los haya recibido.

### ¿Para qué sirve `requestId`? Muestra registros de una misma petición que puedas relacionar mediante él.

Sirve para identificar cada petición y relacionar los registros generados durante su procesamiento. Facilita la depuración cuando existen varias peticiones simultáneas.

Ejemplo ilustrativo (no extraído del servidor):

```text
[ERROR] requestId=abc-123 Document not found
[HTTP] requestId=abc-123 GET /api/v1/admin/documents/999 404
```

Ambos registros tienen el mismo `requestId`, por lo que pueden relacionarse con la misma petición. Para aportar evidencia real, deben sustituirse por los registros de la terminal.

### ¿Es obligatorio separar router, controlador y servicio para desarrollar con Express? Justifica qué aporta esa separación.

No. Express permite implementar toda la lógica directamente en una ruta. Sin embargo, la separación mejora la organización, el mantenimiento, la reutilización y las pruebas del código.

- **Router:** define las rutas y métodos HTTP.
- **Controlador:** recibe las peticiones, valida los datos y gestiona las respuestas.
- **Servicio:** contiene la lógica de negocio y el acceso a los datos.
- **Middleware:** gestiona funcionalidades transversales, como los registros y los errores.

### ¿Qué ocurre con los avisos creados cuando reinicias el servidor? ¿Por qué?

Si los avisos se almacenan en un array en memoria, los avisos nuevos desaparecen al reiniciar el servidor. Al detener el proceso de Node.js se pierde su estado en memoria y, al arrancarlo de nuevo, se inicializan los datos definidos en el código. Para conservar los avisos sería necesario utilizar almacenamiento persistente, como una base de datos.

## Nota de comprobación

Las respuestas se basan en el controlador de documentos facilitado y en el funcionamiento de Express. El orden exacto de los middlewares, la validación de avisos, el formato de los registros, los estados de algunos errores y la persistencia deben confirmarse con los demás archivos del proyecto y las pruebas reales. Los registros incluidos son ilustrativos.

# Batería de peticiones HTTP con CURL

## 1. ¿Qué es CURL?

`curl` es una herramienta que permite realizar peticiones HTTP desde la terminal, sin necesidad de utilizar un navegador o Postman.

Con ella podemos:

- Consultar información (`GET`).
- Crear recursos (`POST`).
- Actualizar información (`PUT` o `PATCH`).
- Eliminar recursos (`DELETE`).
- Enviar datos en formato JSON.
- Comprobar los códigos de respuesta HTTP.

## 2. Preparar el servidor

Primero arrancamos el servidor desde una terminal de VS Code:

```bash
npm run dev
```

Suponiendo que el servidor funciona en el puerto `3000`, la URL base de los avisos es:

```text
http://localhost:3000/api/v1/notices
```

Los siguientes ejemplos están preparados para utilizarse en **Git Bash**.

## 3. Consultar avisos (GET)

### 3.1. Obtener todos los avisos

```bash
curl -i http://localhost:3000/api/v1/notices
```

### 3.2. Consultar avisos con paginación

```bash
curl -i "http://localhost:3000/api/v1/notices?page=1&limit=10"
```

### 3.3. Consultar una segunda página

```bash
curl -i "http://localhost:3000/api/v1/notices?page=2&limit=5"
```

### 3.4. Buscar avisos por texto

```bash
curl -i "http://localhost:3000/api/v1/notices?search=matricula"
```

### 3.5. Combinar búsqueda y paginación

```bash
curl -i "http://localhost:3000/api/v1/notices?page=1&limit=5&search=matricula"
```

### 3.6. Consultar un aviso por su ID

```bash
curl -i http://localhost:3000/api/v1/notices/f07fbc1f-79c4-41f5-a898-4a7a4019c442
```

## 4. Crear avisos (POST)

Para crear un aviso enviamos los datos en formato JSON utilizando `-d` y especificamos el contenido mediante la cabecera `Content-Type`.

### 4.1. Crear un aviso correctamente

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"Aviso de prueba","description":"Este es un aviso creado con curl"}'
```

Respuesta esperada: `201 Created`.

### 4.2. Crear un aviso sin descripción

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"Aviso sin descripción"}'
```

La descripción debería guardarse como una cadena vacía.

### 4.3. Crear un aviso con el título vacío

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"","description":"Prueba de error"}'
```

Debería devolver un error de validación.

### 4.4. Crear un aviso sin título

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"description":"Aviso sin título"}'
```

Debería devolver un error porque el título es obligatorio.

### 4.5. Crear un aviso con espacios en el título

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"     "}'
```

Debería rechazarse porque el título queda vacío después de aplicar `trim()`.

### 4.6. Enviar una descripción que no sea una cadena

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"Aviso incorrecto","description":123}'
```

Debería devolver un error de validación.

## 5. Actualizar avisos (PUT / PATCH)

Estos ejemplos son aplicables si los métodos correspondientes están implementados en las rutas del proyecto.

### 5.1. Actualizar un aviso completo (PUT)

```bash
curl -i -X PUT http://localhost:3000/api/v1/notices/f07fbc1f-79c4-41f5-a898-4a7a4019c442 \
-H "Content-Type: application/json" \
-d '{"title":"Aviso actualizado","description":"Nueva descripción"}'
```

### 5.2. Actualizar solamente el título (PATCH)

```bash
curl -i -X PATCH http://localhost:3000/api/v1/notices/f07fbc1f-79c4-41f5-a898-4a7a4019c442 \
-H "Content-Type: application/json" \
-d '{"title":"Nuevo título"}'
```

### 5.3. Actualizar un aviso inexistente

```bash
curl -i -X PUT http://localhost:3000/api/v1/notices/00000000-0000-0000-0000-000000000000 \
-H "Content-Type: application/json" \
-d '{"title":"Aviso inexistente","description":"Prueba"}'
```

Si el recurso no existe, debería devolver `404 Not Found`.

## 6. Eliminar avisos (DELETE)

Estos ejemplos son aplicables si el método DELETE está implementado.

### 6.1. Eliminar un aviso existente

```bash
curl -i -X DELETE http://localhost:3000/api/v1/notices/ID_DEL_AVISO
```

Hay que sustituir `ID_DEL_AVISO` por el identificador de un aviso real.

### 6.2. Eliminar un aviso inexistente

```bash
curl -i -X DELETE http://localhost:3000/api/v1/notices/00000000-0000-0000-0000-000000000000
```

Si el recurso no existe, debería devolver `404 Not Found`.

## 7. Comprobar errores y funcionamiento del servidor

### 7.1. Comprobar que el servidor funciona

```bash
curl -i http://localhost:3000/health/live
```

Respuesta esperada: `200 OK`, si esta ruta está configurada.

### 7.2. Consultar una ruta inexistente

```bash
curl -i http://localhost:3000/ruta-inventada
```

Respuesta esperada: `404 Not Found`.

### 7.3. Enviar un JSON mal formado

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"Aviso sin cerrar"'
```

Permite comprobar cómo gestiona Express los JSON incorrectos.

### 7.4. Enviar una petición sin Content-Type

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-d '{"title":"Aviso de prueba"}'
```

Permite comprobar cómo responde el servidor cuando no indicamos el tipo de contenido.

## 8. Significado de los parámetros de CURL

| Parámetro | Significado |
|---|---|
| `curl` | Ejecuta la petición HTTP. |
| `-i` | Muestra las cabeceras HTTP de respuesta y el cuerpo. |
| `-X` | Especifica el método HTTP. |
| `-H` | Añade una cabecera HTTP. |
| `-d` | Envía datos en el cuerpo de la petición. |
| `Content-Type` | Indica el tipo de contenido enviado. |
| `application/json` | Indica que los datos enviados están en formato JSON. |

## 9. Códigos de respuesta HTTP

| Código | Significado | Uso habitual |
|---|---|---|
| `200` | OK | Consulta o actualización correcta. |
| `201` | Created | Recurso creado correctamente. |
| `204` | No Content | Operación correcta sin cuerpo de respuesta. |
| `400` | Bad Request | Petición o datos incorrectos. |
| `404` | Not Found | Recurso o ruta inexistente. |
| `405` | Method Not Allowed | Método HTTP no permitido, si está implementado. |
| `500` | Internal Server Error | Error interno del servidor. |

## 10. Chuleta rápida de CURL

### GET - Consultar

```bash
curl -i http://localhost:3000/api/v1/notices
```

### POST - Crear

```bash
curl -i -X POST http://localhost:3000/api/v1/notices \
-H "Content-Type: application/json" \
-d '{"title":"Prueba"}'
```

### PUT - Actualizar completamente

```bash
curl -i -X PUT http://localhost:3000/api/v1/notices/ID \
-H "Content-Type: application/json" \
-d '{"title":"Actualizado","description":"Nueva descripción"}'
```

### PATCH - Actualizar parcialmente

```bash
curl -i -X PATCH http://localhost:3000/api/v1/notices/ID \
-H "Content-Type: application/json" \
-d '{"title":"Nuevo título"}'
```

### DELETE - Eliminar

```bash
curl -i -X DELETE http://localhost:3000/api/v1/notices/ID
```

## 11. Resumen

Los métodos HTTP principales son:

- `GET`: consultar información.
- `POST`: crear un recurso.
- `PUT`: actualizar un recurso completo.
- `PATCH`: actualizar parcialmente un recurso.
- `DELETE`: eliminar un recurso.

CURL permite probar los endpoints directamente desde Git Bash y comprobar tanto las respuestas correctas como los errores del backend.

**Importante:** las peticiones de este documento son ejemplos de prueba. Antes de utilizarlas, hay que comprobar que los métodos y rutas correspondientes están implementados en `routes/notices.ts`. Los ejemplos de validación dependen también de las reglas de `noticesService.ts` y del middleware de errores.
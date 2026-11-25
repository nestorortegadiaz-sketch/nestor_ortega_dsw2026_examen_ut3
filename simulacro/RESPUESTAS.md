# RESPUESTAS

## 1. ¿Cómo se instala y arranca el proyecto?

Para instalar el proyecto, primero hay que tener instalado Node.js.

Una vez abierto el terminal en la carpeta del proyecto, ejecutamos:

```bash
npm install
```

Este comando instala todas las dependencias necesarias que están indicadas en el archivo `package.json`.

Para arrancar el servidor en modo desarrollo, ejecutamos:

```bash
npm run dev
```

Este comando ejecuta el script definido en `package.json`, que inicia el servidor utilizando TypeScript.

## 2. ¿Dónde se configura el puerto y cómo llega ese valor hasta el arranque del servidor?

El puerto se configura mediante una variable de entorno llamada `PORT`, que se define en el archivo `.env`.

En el código del servidor (`server.ts`), se lee su valor mediante `process.env.PORT`.

Ese valor se utiliza en el método `app.listen()`, que es el encargado de poner en marcha el servidor y dejarlo escuchando peticiones en ese puerto.

De esta manera, podemos cambiar el puerto desde el archivo `.env` sin tener que modificar el código del servidor.

## 3. ¿Por qué se sube a GitHub el `.env.example` y se excluye `.env`?

El archivo `.env.example` se sube a GitHub porque sirve como ejemplo de las variables de entorno que necesita el proyecto. Así, cualquier persona que descargue el repositorio sabe qué variables debe configurar.

En cambio, el archivo `.env` se excluye mediante `.gitignore` porque puede contener información privada, como contraseñas, claves o configuraciones propias del equipo.

De esta forma, evitamos publicar información sensible en GitHub y cada desarrollador puede crear su propio archivo `.env` a partir del ejemplo.



# Apartado 1. Fallo de middleware: notFound antes de los routers

## ¿Qué esperaba que sucediera antes de probarlo?

Esperaba que una ruta válida devolviera un error 404 al colocar el middleware `notFound` antes de los routers.

## ¿Qué sucedió realmente?

El comportamiento esperado es que `notFound` intercepte la petición antes de que llegue al router correspondiente, impidiendo la ejecución del controlador.

## ¿Qué respuesta recibí?

La respuesta esperada al realizar la petición `GET /api/v1/admin/documents` es `404 Not Found`, aunque la ruta exista.

## ¿Qué parte del flujo explica el resultado?

Express ejecuta los middlewares en el orden en que se registran. Al colocar `notFound` antes de los routers, se genera el error 404 antes de comprobar si existe una ruta válida.

## ¿Cómo lo corregí?

La corrección consiste en volver a colocar `app.use(notFound)` después de todos los routers y antes de `app.use(errorHandler)`. De esta manera, las rutas válidas pueden ejecutarse normalmente y `notFound` solo actúa cuando ninguna ruta coincide con la petición.

> Nota: los resultados descritos son los esperados. Deben confirmarse mediante la prueba en Bruno.


# Apartado 2. Eliminar temporalmente `next()` del logger

## 1. ¿Qué esperaba que sucediera antes de probarlo?

Esperaba que la petición se quedara esperando, ya que el logger no permitiría continuar al siguiente middleware.

## 2. ¿Qué sucedió realmente?

El comportamiento esperado es que la ejecución se detenga en el logger y no llegue al router ni al controlador.

## 3. ¿Qué respuesta recibí o si la petición quedó esperando?

La petición debería quedarse esperando sin recibir una respuesta HTTP, hasta que se cancele o se agote el tiempo de espera de Bruno.

## 4. ¿Qué parte del flujo explica el resultado?

Express ejecuta los middlewares en el orden en que están registrados. La llamada a `next()` permite continuar al siguiente middleware. Si el logger no llama a `next()` ni envía una respuesta, la petición queda pendiente.

## 5. ¿Cómo lo corregí?

La corrección consiste en restaurar la llamada a `next()` dentro del logger:

```typescript
next();
```

Después, se comprueba que la petición GET a `/api/v1/admin/documents` vuelve a responder con `200 OK`, manteniendo el logger habilitado.

> Nota: los resultados descritos son los esperados; queda confirmarlos mediante la prueba en Bruno.

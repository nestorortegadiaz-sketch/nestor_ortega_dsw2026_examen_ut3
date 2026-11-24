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
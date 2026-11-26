// Punto de entrada: cargar env → crear la aplicación → abrir el puerto TCP.
// Primero se importa config/env.js: al evaluarlo se ejecuta process.loadEnvFile(),
// por lo que si falta .env el proceso se detiene antes de construir la aplicación Express.

import { env } from './config/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

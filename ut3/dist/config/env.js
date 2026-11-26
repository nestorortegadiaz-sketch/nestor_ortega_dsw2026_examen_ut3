// Carga el archivo .env de forma nativa (sin dotenv) y exporta la
// configuración que necesita el servidor. Node process.loadEnvFile() lanza
// una excepción si falta .env, por lo que una configuración incorrecta
// detiene el proceso inmediatamente (sin dependencias adicionales).
// Las variables reales de entorno tienen prioridad sobre los valores de .env.
// El tema 07 protege este archivo validándolo con un esquema de Zod.
process.loadEnvFile();
export const env = {
    PORT: Number(process.env.PORT ?? 3000),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
};
//# sourceMappingURL=env.js.map
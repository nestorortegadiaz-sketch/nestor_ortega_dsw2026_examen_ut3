// createApp() devuelve una aplicación Express configurada.
// Al importar este archivo NO se debe abrir un puerto TCP: .listen() está en server.ts.
// Los middlewares se ejecutan en el orden en que se registran (consulta la actividad 1):
// requestId → logger → express.json → routers → notFound → errorHandler.
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import { notFound } from './middlewares/notFound.js';
import { requestId } from './middlewares/requestId.js';
import { articlesRouter } from './routes/articles.js';
import { healthRouter } from './routes/health.js';
export function createApp() {
    const app = express();
    if (process.env.DEPURACION == undefined) {
        process.env.DEPURACION == 0;
    }
    app.use(requestId); // primero: lo siguiente puede leer req.requestId
    app.use(logger);
    app.use(express.json());
    app.use((req, _res, next) => {
        console.log('[3] JSON procesado', req.requestId, req.body);
        next();
    });
    app.use('/health', healthRouter);
    app.use('/api/v1/articles', articlesRouter);
    app.use(notFound); // solo se alcanza cuando ningún router responde
    app.use(errorHandler); // siempre va al final
    return app;
}
//# sourceMappingURL=app.js.map
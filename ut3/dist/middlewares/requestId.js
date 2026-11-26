import { randomUUID } from 'node:crypto';
export function requestId(req, _res, next) {
    req.requestId = randomUUID();
    console.log('[1] requestId', req.requestId);
    next();
}
//# sourceMappingURL=requestId.js.map
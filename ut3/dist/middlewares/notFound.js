export function notFound(req, res) {
    console.log('[notFound]', req.requestId, req.method, req.path);
    res.status(404).json({
        error: 'NOT_FOUND',
        message: `Route not found: ${req.method} ${req.path}`,
    });
}
//# sourceMappingURL=notFound.js.map
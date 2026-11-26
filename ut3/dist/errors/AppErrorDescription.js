export class AppErrorDescription extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppErrorDescription';
    }
}
//# sourceMappingURL=AppErrorDescription.js.map
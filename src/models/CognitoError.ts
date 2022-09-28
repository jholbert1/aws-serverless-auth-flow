export class CognitoError extends Error {
    message: string;
    code: string;
    error: unknown;
    statusCode: number;

    constructor(message: string, code: string, error: unknown, statusCode: number) {
        super();

        this.message = message;
        this.code = code ?? "UnknownError";
        this.error = error;
        this.statusCode = statusCode;
    }
}

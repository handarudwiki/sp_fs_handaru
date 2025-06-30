export default class ConflictException extends Error {
    statusCode: number;
    message: string;

    constructor(message: string) {
        super(message);
        this.statusCode = 409;
        this.message = message;
    }
}
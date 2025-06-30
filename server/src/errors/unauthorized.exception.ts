export default class UnauthorizedException extends Error {
    statusCode: number;
    message: string;


    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.message = message;
    }
}
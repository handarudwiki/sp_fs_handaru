export default class NotFoundException extends Error {
    statusCode: number;
    message: string;


    constructor(message: string) {
        super(message);
        this.statusCode = 404;
        this.message = message;
    }
}
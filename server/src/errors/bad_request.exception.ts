export default class BadrequestException extends Error {
    statusCode: number;
    message: string;
    details: {};

    constructor(message: string, details: object) {
        super(message);
        this.statusCode = 400;
        this.message = message;
        this.details = details;
    }
}
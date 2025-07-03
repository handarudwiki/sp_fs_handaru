"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadrequestException extends Error {
    constructor(message, details) {
        super(message);
        this.statusCode = 400;
        this.message = message;
        this.details = details;
    }
}
exports.default = BadrequestException;

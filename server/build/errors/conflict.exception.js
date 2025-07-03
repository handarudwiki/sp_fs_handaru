"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConflictException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
        this.message = message;
    }
}
exports.default = ConflictException;

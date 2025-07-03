"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
        this.message = message;
    }
}
exports.default = ForbiddenException;

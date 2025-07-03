"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.message = message;
    }
}
exports.default = NotFoundException;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.message = message;
    }
}
exports.default = UnauthorizedException;

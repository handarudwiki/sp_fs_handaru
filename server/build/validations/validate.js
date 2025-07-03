"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bad_request_exception_1 = __importDefault(require("../errors/bad_request.exception"));
class Validation {
    static validate(schema, data) {
        const result = schema.safeParse(data);
        if (!result.success) {
            console.log(result.error.errors);
            throw new bad_request_exception_1.default("Invalid input", result.error.errors.map((error) => {
                return {
                    message: error.message,
                    path: error.path,
                };
            }));
        }
        return result.data;
    }
}
exports.default = Validation;

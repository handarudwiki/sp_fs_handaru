"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const bad_request_exception_1 = __importDefault(require("../errors/bad_request.exception"));
const forbidden_exception_1 = __importDefault(require("../errors/forbidden.exception"));
const unauthorized_exception_1 = __importDefault(require("../errors/unauthorized.exception"));
const conflict_exception_1 = __importDefault(require("../errors/conflict.exception"));
const not_found_exception_1 = __importDefault(require("../errors/not_found.exception"));
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof bad_request_exception_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
            details: err.details,
        });
    }
    else if (err instanceof conflict_exception_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    else if (err instanceof forbidden_exception_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    else if (err instanceof unauthorized_exception_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    else if (err instanceof not_found_exception_1.default) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    console.error(err);
    res.status(500).json({
        message: "Internal Server Error",
    });
};
exports.errorMiddleware = errorMiddleware;

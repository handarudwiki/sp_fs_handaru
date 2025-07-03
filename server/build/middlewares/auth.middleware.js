"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../helpers/jwt");
const unauthorized_exception_1 = __importDefault(require("../errors/unauthorized.exception"));
const authMiddleware = () => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new unauthorized_exception_1.default('Token not provided');
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            throw new unauthorized_exception_1.default('Invalid token');
        }
        const { userId } = decoded;
        req.user = {
            id: userId,
        };
        next();
    };
};
exports.default = authMiddleware;

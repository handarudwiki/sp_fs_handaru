"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (userId) => {
    return (0, jsonwebtoken_1.sign)({ userId, }, process.env.JWT_SECRET);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const success_response_1 = __importDefault(require("../helpers/success_response"));
class UserController {
    static async register(req, res, next) {
        try {
            const result = await user_service_1.default.register(req.body);
            (0, success_response_1.default)(res, result, "User registered successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const result = await user_service_1.default.login(req.body);
            (0, success_response_1.default)(res, result, "User logged in successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async findAll(req, res, next) {
        try {
            const result = await user_service_1.default.search(req.user?.id, req.query.q);
            (0, success_response_1.default)(res, result, "Users fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = UserController;

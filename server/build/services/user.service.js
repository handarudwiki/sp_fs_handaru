"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthorized_exception_1 = __importDefault(require("../errors/unauthorized.exception"));
const jwt_1 = require("../helpers/jwt");
const prisma_1 = __importDefault(require("../helpers/prisma"));
const validate_1 = __importDefault(require("../validations/validate"));
const user_validation_1 = __importDefault(require("./../validations/user.validation"));
const bcryptjs_1 = require("bcryptjs");
class UserService {
    static async search(userId, search) {
        {
            const users = await prisma_1.default.user.findMany({
                select: {
                    id: true,
                    email: true,
                },
                where: {
                    NOT: {
                        id: userId,
                    },
                    email: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            });
            return users;
        }
    }
    static async register(dto) {
        const validData = validate_1.default.validate(user_validation_1.default.LOGIN, dto);
        const { email, password } = validData;
        const isuserExist = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (isuserExist) {
            throw new unauthorized_exception_1.default("Email already exists");
        }
        const hashPassord = await (0, bcryptjs_1.hash)(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashPassord
            },
            select: {
                id: true,
                email: true,
            }
        });
        return user;
    }
    static async login(dto) {
        const validData = validate_1.default.validate(user_validation_1.default.LOGIN, dto);
        const { email, password } = validData;
        const isuserExist = await prisma_1.default.user.findUnique({
            where: {
                email
            }
        });
        if (!isuserExist) {
            throw new unauthorized_exception_1.default("Email or password is incorrect");
        }
        const isPasswordMatch = await (0, bcryptjs_1.compare)(password, isuserExist.password);
        if (!isPasswordMatch) {
            throw new unauthorized_exception_1.default("Email or password is incorrect");
        }
        return {
            token: (0, jwt_1.generateToken)(isuserExist.id),
        };
    }
}
exports.default = UserService;

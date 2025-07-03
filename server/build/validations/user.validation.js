"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
class UserValidation {
}
UserValidation.LOGIN = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters long" })
});
UserValidation.REGISTER = UserValidation.LOGIN.extend({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(6, { message: "Password must be at least 6 characters long" })
});
exports.default = UserValidation;

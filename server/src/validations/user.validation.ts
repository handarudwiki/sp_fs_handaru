import { z } from "zod";

export default class UserValidation {
    static LOGIN = z.object({
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" })
    })
    static REGISTER = UserValidation.LOGIN.extend({
         email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" })
    })
}

export type UserLogin = z.infer<typeof UserValidation.LOGIN>;
export type UserRegister = z.infer<typeof UserValidation.REGISTER>;
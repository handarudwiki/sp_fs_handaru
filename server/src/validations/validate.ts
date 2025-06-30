import { ZodSchema } from "zod";
import BadrequestException from "../errors/bad_request.exception";

export default class Validation {
    static validate<T>(schema: ZodSchema, data:T):T{
        const result = schema.safeParse(data);
        if (!result.success) {
            console.log(result.error.errors);
            throw new BadrequestException("Invalid input",result.error.errors.map((error) => {
                return {
                    message : error.message,
                    path : error.path,
                }
               }));
        }
        return result.data;
}
}
import {sign, verify} from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();


export const generateToken = (userId: string, role) => {
    return sign(
      { userId, role },
      process.env.JWT_SECRET as string,
    );
  };

export const verifyToken = (token: string) => {
    try {
        const decoded = verify(token, process.env.JWT_SECRET as string);
        return decoded;
    } catch (error) {
        return null;
    }
}
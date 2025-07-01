import {NextFunction, Request, Response} from 'express';
import { verifyToken } from '../helpers/jwt';
import UnauthorizedException from '../errors/unauthorized.exception';

declare global {
    namespace Express {
        interface Request {
        user?: {
            id: string;
        };
        }
    }
}

const authMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
       const token = req.headers['authorization']?.split(' ')[1];

       if (!token) {
            throw new UnauthorizedException('Token not provided');
       }

        const decoded = verifyToken(token);

        if (!decoded) {
            throw new UnauthorizedException('Invalid token');
        }

        const {userId} = decoded as {userId: string};

        req.user = {
            id: userId,
        };
        next();
    };
}

export default authMiddleware;
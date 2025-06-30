import { NextFunction, Request, Response } from "express";
import BadrequestException from "../errors/bad_request.exception";

import ForbiddenException from "../errors/forbidden.exception";
import UnauthorizedException from "../errors/unauthorized.exception";
import ConflictException from "../errors/conflict.exception";
import NotFoundException from "../errors/not_found.exception";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof BadrequestException){
         res.status(err.statusCode).json({
            message: err.message,
            details: err.details,
        });
    } else if (err instanceof ConflictException){
         res.status(err.statusCode).json({
            message: err.message,
        });
    }else if (err instanceof ForbiddenException){
         res.status(err.statusCode).json({
            message: err.message,
        });
    }else if ( err instanceof UnauthorizedException){
         res.status(err.statusCode).json({
            message: err.message,
        });
    } else if (err instanceof NotFoundException) {
            res.status(err.statusCode).json({
                message: err.message,
            });
    }
    console.error(err);
     res.status(500).json({
        message: "Internal Server Error",
    });
}
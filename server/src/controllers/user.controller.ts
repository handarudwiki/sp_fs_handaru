import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import successResponse from "../helpers/success_response";

export default class UserController {
    static async register(req:Request, res:Response, next:NextFunction) {
        try {
            const result = await UserService.register(req.body);
            
             successResponse(res, result, "User registered successfully");
        } catch (error) {
            next(error);
        }
    }

    static async login(req:Request, res:Response, next:NextFunction) {
        try {
            const result = await UserService.login(req.body);
            
             successResponse(res, result, "User logged in successfully");
        } catch (error) {
            next(error);
        }
    }

    static async findAll(req:Request, res:Response, next:NextFunction) {
        try {
            const result = await UserService.search(req.user?.id!, req.query.q as string);
            
             successResponse(res, result, "Users fetched successfully");
        } catch (error) {
            next(error);
        }
    }
}
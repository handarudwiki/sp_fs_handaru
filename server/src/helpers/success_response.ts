import { Response } from "express";

const successResponse = (res: Response, data: any, message: string) => {
    return res.status(200).json({
        message: message,
        data: data,
    });
}

export default successResponse;
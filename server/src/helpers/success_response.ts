import { Response } from "express";

type Meta = {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
}

const successResponse = (res: Response, data: any, message: string, meta?:Meta) => {
    return res.status(200).json({
        message: message,
        data: data,
        meta: meta 
    });
}

export default successResponse;
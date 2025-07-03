"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse = (res, data, message, meta) => {
    return res.status(200).json({
        message: message,
        data: data,
        meta: meta
    });
};
exports.default = successResponse;

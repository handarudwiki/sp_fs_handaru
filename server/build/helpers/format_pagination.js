"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formatPagination;
function formatPagination(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
}

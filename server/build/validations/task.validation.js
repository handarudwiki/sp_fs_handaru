"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
class TaskValidation {
}
TaskValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    project_id: zod_1.z.string().uuid({ message: "Invalid project ID format" }),
    assigned_id: zod_1.z.string().uuid({ message: "Invalid user ID format" }),
});
TaskValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid task ID format" }),
    title: zod_1.z.string().min(1, { message: "Title is required" }).optional(),
    description: zod_1.z.string().min(1, { message: "Description is required" }).optional(),
    project_id: zod_1.z.string().uuid({ message: "Invalid project ID format" }).optional(),
    assigned_id: zod_1.z.string().uuid({ message: "Invalid user ID format" }).optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
});
TaskValidation.DELETE = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid task ID format" }),
});
TaskValidation.FILTER = zod_1.z.object({
    project_id: zod_1.z.string().uuid({ message: "Invalid project ID format" }),
    assigned_id: zod_1.z.string().uuid({ message: "Invalid user ID format" }).optional(),
    status: zod_1.z.nativeEnum(client_1.TaskStatus).optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.number().int().min(1, { message: "Page must be a positive integer" }).default(1),
    limit: zod_1.z.number().int().min(1, { message: "Limit must be a positive integer" }).max(100, { message: "Limit cannot exceed 100" }),
});
exports.default = TaskValidation;

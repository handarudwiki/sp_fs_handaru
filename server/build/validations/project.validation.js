"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
class ProjectValidation {
}
ProjectValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Project name is required" }),
    owner_id: zod_1.z.string().uuid({ message: "Invalid owner ID format" }),
});
ProjectValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid project ID format" }),
    name: zod_1.z.string().min(1, { message: "Project name is required" }).optional(),
    owner_id: zod_1.z.string().uuid({ message: "Invalid owner ID format" }).optional(),
});
ProjectValidation.DELETE = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: "Invalid project ID format" }),
    owner_id: zod_1.z.string().uuid({ message: "Invalid owner ID format" }),
});
ProjectValidation.BATCH_DELETE = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string().uuid({ message: "Invalid project ID format" })).nonempty({ message: "At least one project ID is required" }),
});
ProjectValidation.FILTER = zod_1.z.object({
    user_id: zod_1.z.string().uuid(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.number().int().min(1, { message: "Page must be a positive integer" }).default(1),
    limit: zod_1.z.number().int().min(1, { message: "Limit must be a positive integer" }).max(100, { message: "Limit cannot exceed 100" }),
});
ProjectValidation.INVIT_MEMBER = zod_1.z.object({
    owner_id: zod_1.z.string().uuid({ message: "Invalid owner ID format" }),
    project_id: zod_1.z.string().uuid({ message: "Invalid project ID format" }),
    user_id: (zod_1.z.string().uuid({ message: "Invalid user ID format" }))
});
ProjectValidation.KICK_MEMBER = zod_1.z.object({
    owner_id: zod_1.z.string().uuid({ message: "Invalid owner ID format" }),
    project_id: zod_1.z.string().uuid({ message: "Invalid project ID format" }),
    user_id: zod_1.z.string().uuid({ message: "Invalid user ID format" })
});
exports.default = ProjectValidation;

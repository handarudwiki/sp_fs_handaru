import { z } from "zod";
import { TaskStatus } from "../generated/prisma";

export default class TaskValidation {
    static CREATE = z.object({
        title: z.string().min(1, { message: "Title is required" }),
        description: z.string().min(1, { message: "Description is required" }),
        project_id: z.string().uuid({ message: "Invalid project ID format" }),
        assigned_id: z.string().uuid({ message: "Invalid user ID format" }),
    });

    static UPDATE = z.object({
        id: z.string().uuid({ message: "Invalid task ID format" }),
        title: z.string().min(1, { message: "Title is required" }).optional(),
        description: z.string().min(1, { message: "Description is required" }).optional(),
        project_id: z.string().uuid({ message: "Invalid project ID format" }).optional(),
        assigned_id: z.string().uuid({ message: "Invalid user ID format" }).optional(),
        status: z.nativeEnum(TaskStatus).optional(),
    });

    static DELETE = z.object({
        id: z.string().uuid({ message: "Invalid task ID format" }),
    });

    static FILTER = z.object({
        project_id: z.string().uuid({ message: "Invalid project ID format" }),
        assigned_id: z.string().uuid({ message: "Invalid user ID format" }).optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        search: z.string().optional(),
        page: z.number().int().min(1, { message: "Page must be a positive integer" }).default(1),
        limit: z.number().int().min(1, { message: "Limit must be a positive integer" }).max(100, { message: "Limit cannot exceed 100" }),
    });
}

export type TaskCreate = z.infer<typeof TaskValidation.CREATE>;
export type TaskUpdate = z.infer<typeof TaskValidation.UPDATE>;
export type TaskDelete = z.infer<typeof TaskValidation.DELETE>;
export type TaskFilter = z.infer<typeof TaskValidation.FILTER>;
export type TaskStatusUpdate = z.infer<typeof TaskValidation.UPDATE> & { status: TaskStatus };
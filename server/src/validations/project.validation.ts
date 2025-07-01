import { z } from "zod";

export default class ProjectValidation {
    static CREATE = z.object({
        name : z.string().min(1, { message: "Project name is required" }),
        owner_id : z.string().uuid({ message: "Invalid owner ID format" }),
    })

    static UPDATE = z.object({
        id: z.string().uuid({ message: "Invalid project ID format" }),
        name: z.string().min(1, { message: "Project name is required" }).optional(),
        owner_id: z.string().uuid({ message: "Invalid owner ID format" }).optional(),
    })

    static DELETE = z.object({
        id: z.string().uuid({ message: "Invalid project ID format" }),
        owner_id: z.string().uuid({ message: "Invalid owner ID format" }),
    })

    static BATCH_DELETE = z.object({
        ids: z.array(z.string().uuid({ message: "Invalid project ID format" })).nonempty({ message: "At least one project ID is required" }),
    })

    static FILTER = z.object({
        user_id : z.string().uuid(),
        search : z.string().optional(),
        page : z.number().int().min(1, { message: "Page must be a positive integer" }).default(1),
        limit : z.number().int().min(1, { message: "Limit must be a positive integer" }).max(100, { message: "Limit cannot exceed 100" }),
    })

    static INVIT_MEMBER = z.object({
        owner_id: z.string().uuid({ message: "Invalid owner ID format" }),
        project_id: z.string().uuid({ message: "Invalid project ID format" }),
        user_id : (z.string().uuid({ message: "Invalid user ID format" }))
    })

    static KICK_MEMBER = z.object({
        owner_id: z.string().uuid({ message: "Invalid owner ID format" }),
        project_id: z.string().uuid({ message: "Invalid project ID format" }),
        user_id: z.string().uuid({ message: "Invalid user ID format" })
    })
}

export type ProjectCreate = z.infer<typeof ProjectValidation.CREATE>;
export type ProjectUpdate = z.infer<typeof ProjectValidation.UPDATE>;
export type ProjectDelete = z.infer<typeof ProjectValidation.DELETE>;
export type ProjectBatchDelete = z.infer<typeof ProjectValidation.BATCH_DELETE>;
export type ProjectFilter = z.infer<typeof ProjectValidation.FILTER>
export type ProjectInviteMember = z.infer<typeof ProjectValidation.INVIT_MEMBER>;
export type ProjectKickMember = z.infer<typeof ProjectValidation.KICK_MEMBER>;
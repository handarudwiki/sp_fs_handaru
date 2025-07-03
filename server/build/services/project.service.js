"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const forbidden_exception_1 = __importDefault(require("../errors/forbidden.exception"));
const prisma_1 = __importDefault(require("../helpers/prisma"));
const project_validation_1 = __importDefault(require("../validations/project.validation"));
const validate_1 = __importDefault(require("../validations/validate"));
const format_pagination_1 = __importDefault(require("../helpers/format_pagination"));
const pagination_1 = require("../consts/pagination");
const not_found_exception_1 = __importDefault(require("../errors/not_found.exception"));
class ProjectService {
    static async create(dto) {
        const validData = validate_1.default.validate(project_validation_1.default.CREATE, dto);
        const { name, owner_id } = validData;
        const project = await prisma_1.default.project.create({
            data: {
                name,
                ownerId: owner_id,
            },
            select: {
                id: true,
                name: true,
                ownerId: true,
            },
        });
        return project;
    }
    static async update(dto) {
        const validData = validate_1.default.validate(project_validation_1.default.UPDATE, dto);
        const { id, name, owner_id } = validData;
        const isProjectExist = await prisma_1.default.project.findUnique({
            where: { id },
        });
        if (!isProjectExist) {
            throw new Error("Project not found");
        }
        if (isProjectExist.ownerId !== owner_id) {
            throw new forbidden_exception_1.default("You are not authorized to update this project");
        }
        const project = await prisma_1.default.project.update({
            where: { id },
            data: {
                name,
                ownerId: owner_id,
            },
            select: {
                id: true,
                name: true,
                ownerId: true,
            },
        });
        return project;
    }
    static async findAll(filter) {
        const validData = validate_1.default.validate(project_validation_1.default.FILTER, filter);
        const { user_id, search, page = pagination_1.defaultLimit, limit = pagination_1.defaultPage } = validData;
        const where = {
            OR: [
                { ownerId: user_id },
                { memberships: {
                        some: {
                            userId: user_id,
                        },
                    },
                }
            ],
        };
        if (search) {
            where.name = {
                contains: search,
                mode: "insensitive",
            };
        }
        const projects = await prisma_1.default.project.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                name: true,
                ownerId: true,
                memberships: {
                    select: {
                        userId: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        return {
            data: projects,
            meta: (0, format_pagination_1.default)(page, limit, await prisma_1.default.project.count({ where })),
        };
    }
    static async delete(dto) {
        const validData = validate_1.default.validate(project_validation_1.default.DELETE, dto);
        const { id, owner_id } = validData;
        const isProjectExist = await prisma_1.default.project.findUnique({
            where: { id },
        });
        if (!isProjectExist) {
            throw new Error("Project not found");
        }
        if (isProjectExist.ownerId !== owner_id) {
            throw new forbidden_exception_1.default("You are not authorized to delete this project");
        }
        await prisma_1.default.project.delete({
            where: { id },
        });
        return { message: "Project deleted successfully" };
    }
    static async invitMember(dto) {
        const validData = validate_1.default.validate(project_validation_1.default.INVIT_MEMBER, dto);
        const { project_id, user_id, owner_id } = validData;
        const isProjectExist = await prisma_1.default.project.findUnique({
            where: { id: project_id },
        });
        if (!isProjectExist) {
            throw new not_found_exception_1.default("Project not found");
        }
        if (isProjectExist.ownerId !== owner_id) {
            throw new forbidden_exception_1.default("You are not authorized to invite members to this project");
        }
        await prisma_1.default.membership.create({
            data: {
                projectId: project_id,
                userId: user_id,
            },
            select: {
                id: true,
                projectId: true,
                userId: true,
            },
        });
    }
    static async kickMember(dto) {
        const validData = validate_1.default.validate(project_validation_1.default.KICK_MEMBER, dto);
        const { project_id, user_id, owner_id } = validData;
        const isProjectExist = await prisma_1.default.project.findUnique({
            where: { id: project_id },
        });
        if (!isProjectExist) {
            throw new Error("Project not found");
        }
        if (isProjectExist.ownerId !== owner_id) {
            throw new forbidden_exception_1.default("You are not authorized to kick members from this project");
        }
        const membership = await prisma_1.default.membership.deleteMany({
            where: {
                projectId: project_id,
                userId: user_id,
            },
        });
        if (membership.count === 0) {
            throw new Error("Membership not found");
        }
        return { message: "Member kicked successfully" };
    }
    static async details(projectId) {
        const isProjectExist = await prisma_1.default.project.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                name: true,
                ownerId: true,
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        status: true,
                        assignedId: true,
                    }
                },
                owner: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                memberships: {
                    select: {
                        userId: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!isProjectExist) {
            throw new Error("Project not found");
        }
        return isProjectExist;
    }
    static async getMembers(projectId) {
        const isProjectExist = await prisma_1.default.project.findUnique({
            where: { id: projectId },
            select: {
                memberships: {
                    select: {
                        userId: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!isProjectExist) {
            throw new Error("Project not found");
        }
        return isProjectExist.memberships;
    }
}
exports.default = ProjectService;

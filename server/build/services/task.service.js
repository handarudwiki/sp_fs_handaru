"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("../consts/pagination");
const prisma_1 = __importDefault(require("../helpers/prisma"));
const task_validation_1 = __importDefault(require("../validations/task.validation"));
const validate_1 = __importDefault(require("../validations/validate"));
const format_pagination_1 = __importDefault(require("../helpers/format_pagination"));
class TaskService {
    static async create(dto) {
        const validData = validate_1.default.validate(task_validation_1.default.CREATE, dto);
        const { title, description, project_id, assigned_id } = validData;
        const task = await prisma_1.default.task.create({
            data: {
                title,
                description,
                projectId: project_id,
                assignedId: assigned_id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                projectId: true,
            },
        });
        return task;
    }
    static async update(dto) {
        const validData = validate_1.default.validate(task_validation_1.default.UPDATE, dto);
        const { id, title, description, project_id, assigned_id, status } = validData;
        const isTaskExist = await prisma_1.default.task.findUnique({
            where: { id },
        });
        if (!isTaskExist) {
            throw new Error("Task not found");
        }
        const task = await prisma_1.default.task.update({
            where: { id },
            data: {
                title,
                description,
                projectId: project_id,
                assignedId: assigned_id,
                status,
            },
            select: {
                id: true,
                title: true,
                description: true,
                projectId: true,
            },
        });
        return task;
    }
    static async delete(dto) {
        const validData = validate_1.default.validate(task_validation_1.default.DELETE, dto);
        const { id } = validData;
        const isTaskExist = await prisma_1.default.task.findUnique({
            where: { id },
        });
        if (!isTaskExist) {
            throw new Error("Task not found");
        }
        const task = await prisma_1.default.task.delete({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                projectId: true,
            },
        });
        return task;
    }
    static async findAll(filter) {
        const validData = validate_1.default.validate(task_validation_1.default.FILTER, filter);
        const { project_id, assigned_id, status, search, page = pagination_1.defaultPage, limit = pagination_1.defaultLimit, } = validData;
        const where = {
            projectId: project_id,
        };
        if (assigned_id) {
            where.assignedId = assigned_id;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        const tasks = await prisma_1.default.task.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                title: true,
                description: true,
                projectId: true,
                assignedId: true,
                status: true,
                assigned: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        return {
            data: tasks,
            meta: (0, format_pagination_1.default)(page, limit, await prisma_1.default.task.count({ where })),
        };
    }
    static async analytics(projectId) {
        const result = await prisma_1.default.task.groupBy({
            by: ["status"],
            where: { projectId },
            _count: true,
        });
        const summary = {
            todo: 0,
            inProgress: 0,
            done: 0,
        };
        for (const row of result) {
            if (row.status === "TODO")
                summary.todo = row._count;
            if (row.status === "IN_PROGRESS")
                summary.inProgress = row._count;
            if (row.status === "DONE")
                summary.done = row._count;
        }
        return summary;
    }
}
exports.default = TaskService;

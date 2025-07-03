"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = __importDefault(require("../helpers/success_response"));
const task_service_1 = __importDefault(require("../services/task.service"));
class TaskController {
    static async create(req, res, next) {
        try {
            const result = await task_service_1.default.create(req.body);
            (0, success_response_1.default)(res, result, "Task created successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            req.body.id = req.params.id;
            const result = await task_service_1.default.update(req.body);
            (0, success_response_1.default)(res, result, "Task updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const data = {
                id: req.params.id,
            };
            const result = await task_service_1.default.delete(data);
            (0, success_response_1.default)(res, result, "Task deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async findAll(req, res, next) {
        try {
            const filter = {
                project_id: req.params.projectId,
                assigned_id: req.query.assigned_id,
                status: req.query.status,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
            };
            const result = await task_service_1.default.findAll(filter);
            (0, success_response_1.default)(res, result, "Tasks retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async analytics(req, res, next) {
        try {
            const taskId = req.params.projectId;
            const result = await task_service_1.default.analytics(taskId);
            (0, success_response_1.default)(res, result, "Task retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = TaskController;

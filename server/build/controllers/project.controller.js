"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_service_1 = __importDefault(require("../services/project.service"));
const success_response_1 = __importDefault(require("../helpers/success_response"));
class ProjectController {
    static async create(req, res, next) {
        try {
            const data = {
                ...req.body,
                owner_id: req.user?.id
            };
            const project = await project_service_1.default.create(data);
            (0, success_response_1.default)(res, project, "Project created successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const data = req.body;
            data.owner_id = req.user?.id;
            data.id = req.params.id;
            const project = await project_service_1.default.update(data);
            (0, success_response_1.default)(res, project, "Project updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const data = {
                id: req.params.id,
                owner_id: req.user?.id
            };
            await project_service_1.default.delete(data);
            (0, success_response_1.default)(res, null, "Project deleted successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async findAll(req, res, next) {
        try {
            const data = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                user_id: req.user?.id,
                search: req.query.search || ""
            };
            const projects = await project_service_1.default.findAll(data);
            (0, success_response_1.default)(res, projects.data, "Projects retrieved successfully", projects.meta);
        }
        catch (error) {
            next(error);
        }
    }
    static async inviteMember(req, res, next) {
        try {
            const data = {
                project_id: req.params.id,
                user_id: req.body.user_id,
                owner_id: req.user?.id
            };
            const result = await project_service_1.default.invitMember(data);
            (0, success_response_1.default)(res, result, "Member invited successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async kickMember(req, res, next) {
        try {
            const data = {
                project_id: req.params.id,
                user_id: req.body.user_id,
                owner_id: req.user?.id
            };
            const result = await project_service_1.default.kickMember(data);
            (0, success_response_1.default)(res, result, "Member kicked successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async details(req, res, next) {
        try {
            const projectId = req.params.id;
            const project = await project_service_1.default.details(projectId);
            (0, success_response_1.default)(res, project, "Project details retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    static async getMembers(req, res, next) {
        try {
            const projectId = req.params.id;
            const members = await project_service_1.default.getMembers(projectId);
            (0, success_response_1.default)(res, members, "Project members retrieved successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = ProjectController;

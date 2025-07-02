import { NextFunction, Request, Response } from "express";
import successResponse from "../helpers/success_response";
import TaskService from "../services/task.service";
import { TaskCreate, TaskDelete, TaskFilter } from "../validations/task.validation";
import { TaskStatus } from "@prisma/client";

export default class TaskController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            
            const result = await TaskService.create(req.body);
            
            // Send success response
            successResponse(res, result, "Task created successfully");
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            req.body.id = req.params.id; // Assuming task ID is passed as a URL parameter

            const result = await TaskService.update(req.body);
            
            // Send success response
            successResponse(res, result, "Task updated successfully");
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const data:TaskDelete = {
                id: req.params.id, // Assuming task ID is passed as a URL parameter
            };

            const result = await TaskService.delete(data);
            
            // Send success response
            successResponse(res, result, "Task deleted successfully");
        } catch (error) {
            next(error);
        }
    }

    static async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const filter:TaskFilter = {
                project_id: req.params.projectId as string, // Assuming project ID is passed as a
                assigned_id: req.query.assigned_id as string, // Assuming assigned user ID is passed as a query parameter
                status: req.query.status as TaskStatus, // Assuming task status is passed as a query parameter
                page: parseInt(req.query.page as string) || 1, // Assuming pagination is handled via query parameters
                limit: parseInt(req.query.limit as string) || 10,
                search: req.query.search as string, // Assuming search term is passed as a query parameter
            }

            const result = await TaskService.findAll(filter);
            
            // Send success response
            successResponse(res, result, "Tasks retrieved successfully");
        } catch (error) {
            next(error);
        }
    }

    static async analytics(req: Request, res: Response, next: NextFunction) {
        try {
            const taskId = req.params.projectId; // Assuming task ID is passed as a URL parameter

            const result = await TaskService.analytics(taskId);
            
            // Send success response
            successResponse(res, result, "Task retrieved successfully");
        } catch (error) {
            next(error);
        }
    }
}
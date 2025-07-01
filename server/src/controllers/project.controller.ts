import { string } from 'zod';
import { NextFunction, Request, Response } from "express";
import ProjectService from "../services/project.service";
import successResponse from "../helpers/success_response";
import { ProjectCreate, ProjectDelete, ProjectFilter, ProjectInviteMember, ProjectKickMember } from "../validations/project.validation";

export default class ProjectController {
    static async create(req:Request, res:Response, next:NextFunction) {
        try {
            
            const data:ProjectCreate = {
                ...req.body,
                owner_id: req.user?.id // Assuming req.user is set by auth middleware
            }
            const project = await ProjectService.create(data);
            successResponse(res, project, "Project created successfully");
        } catch (error) {
            next(error);
        }
    }

    static async update(req:Request, res:Response, next:NextFunction) {
        try {
            // Logic to update a project
            const data = req.body;
            data.owner_id = req.user?.id;
            data.id = req.params.id; // Assuming project ID is passed as a URL parameter
            const project = await ProjectService.update(data);
            successResponse(res, project, "Project updated successfully");
        } catch (error) {
            next(error);
        }
    }

    static async delete(req:Request, res:Response, next:NextFunction) {
        try {
            const data = {
                id: req.params.id, 
                owner_id: req.user?.id
            } 
            await ProjectService.delete(data as ProjectDelete); 
            successResponse(res, null, "Project deleted successfully");
        } catch (error) {
            next(error);
        }
    }

    static async findAll(req:Request, res:Response, next:NextFunction) {
        try {
            const data:ProjectFilter = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                user_id: req.user?.id!, // Assuming req.user is set by auth middleware
                search: req.query.search as string || ""
            } 
            const projects = await ProjectService.findAll(data);
            successResponse(res, projects.data, "Projects retrieved successfully", projects.meta);
        } catch (error) {
            next(error);
        }
    }

    static async inviteMember (req:Request, res:Response, next:NextFunction) {
        try {
            const data:ProjectInviteMember = {
                project_id: req.params.id,
                user_id: req.body.user_id,
                owner_id: req.user?.id! // Assuming req.user is set by auth middleware
            } // Assuming req.user is set by auth middleware
            
            const result = await ProjectService.invitMember(data);
            successResponse(res, result, "Member invited successfully");
        } catch (error) {
            next(error);
        }
    }

    static async kickMember(req:Request, res:Response, next:NextFunction) {
        try {
           const data:ProjectKickMember = {
                project_id: req.params.id, // Assuming project ID is passed as a URL parameter
                user_id: req.body.user_id, // Assuming user ID to kick is passed in the request body
                owner_id: req.user?.id! // Assuming req.user is set by auth middleware
            } // Assuming req.user is set by auth middleware
            const result = await ProjectService.kickMember(data);
            successResponse(res, result, "Member kicked successfully");
        } catch (error) {
            next(error);
        }
    }

    static async details(req:Request, res:Response, next:NextFunction) {
        try {
            const projectId = req.params.id; // Assuming project ID is passed as a URL parameter
            const project = await ProjectService.details(projectId);
        
            successResponse(res, project, "Project details retrieved successfully");
        } catch (error) {
            next(error);
        }
    }


}
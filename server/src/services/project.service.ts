import { format } from "path";
import ForbiddenException from "../errors/forbidden.exception";
import { Prisma } from "../generated/prisma";
import prisma from "../helpers/prisma";
import ProjectValidation, {
  ProjectCreate,
  ProjectDelete,
  ProjectFilter,
  ProjectInviteMember,
  ProjectKickMember,
  ProjectUpdate,
} from "../validations/project.validation";
import Validation from "../validations/validate";
import formatPagination from "../helpers/format_pagination";
import { defaultLimit, defaultPage  } from "../consts/pagination";
import NotFoundException from "../errors/not_found.exception";


export default class ProjectService {
  static async create(dto: ProjectCreate) {
    const validData = Validation.validate(ProjectValidation.CREATE, dto); // Assuming dto is already validated

    const { name, owner_id } = validData;

    const project = await prisma.project.create({
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

  static async update(dto: ProjectUpdate) {
    const validData = Validation.validate(ProjectValidation.UPDATE, dto);

    const { id, name, owner_id } = validData;

    const isProjectExist = await prisma.project.findUnique({
      where: { id },
    });

    if (!isProjectExist) {
      throw new Error("Project not found");
    }

    if (isProjectExist.ownerId !== owner_id) {
      throw new ForbiddenException(
        "You are not authorized to update this project"
      );
    }

    const project = await prisma.project.update({
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

  static async findAll(filter: ProjectFilter) {
    const validData = Validation.validate(ProjectValidation.FILTER, filter);

    const { user_id, search, page=defaultLimit, limit=defaultPage } = validData;

    const where: Prisma.ProjectWhereInput = {
      OR: [
        
          {ownerId: user_id},
          {memberships: {
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


    const projects = await prisma.project.findMany({
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
        meta: formatPagination(page, limit, await prisma.project.count({ where })),
    };
  }

  static async delete(dto: ProjectDelete) {
    const validData = Validation.validate(ProjectValidation.DELETE, dto);

    const { id, owner_id } = validData;

    const isProjectExist = await prisma.project.findUnique({
      where: { id },
    });

    if (!isProjectExist) {
      throw new Error("Project not found");
    }

    if (isProjectExist.ownerId !== owner_id) {
      throw new ForbiddenException(
        "You are not authorized to delete this project"
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return { message: "Project deleted successfully" };
  }

  static async invitMember(dto:ProjectInviteMember){
    const validData = Validation.validate(ProjectValidation.INVIT_MEMBER, dto);

    const { project_id, user_id, owner_id } = validData;

    const isProjectExist = await prisma.project.findUnique({
      where: { id: project_id },
    });

    if (!isProjectExist) {
      throw new NotFoundException("Project not found");
    }

    if (isProjectExist.ownerId !== owner_id) {
      throw new ForbiddenException(
        "You are not authorized to invite members to this project"
      );
    }
     await prisma.membership.create({
      data: {
        projectId: project_id,
        userId: user_id,
      },
      select: {
        id: true,
        projectId: true,
        userId: true,
      },
    })
  }

    static async kickMember(dto: ProjectKickMember) {
        const validData = Validation.validate(ProjectValidation.KICK_MEMBER, dto);
    
        const { project_id, user_id, owner_id } = validData;
    
        const isProjectExist = await prisma.project.findUnique({
        where: { id: project_id },
        });
    
        if (!isProjectExist) {
        throw new Error("Project not found");
        }

        if (isProjectExist.ownerId !== owner_id) {
        throw new ForbiddenException(
            "You are not authorized to kick members from this project"
        );
        }
    
        const membership = await prisma.membership.deleteMany({
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

    static async details(projectId: string) {
        const isProjectExist = await prisma.project.findUnique({
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
                owner:{
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
}

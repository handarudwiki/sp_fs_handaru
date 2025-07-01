import { format } from "path";
import { defaultLimit, defaultPage } from "../consts/pagination";
import prisma from "../helpers/prisma";
import TaskValidation, {
  TaskCreate,
  TaskDelete,
  TaskUpdate,
} from "../validations/task.validation";
import Validation from "../validations/validate";
import formatPagination from "../helpers/format_pagination";
import { Prisma } from "../generated/prisma";

export default class TaskService {
  static async create(dto: TaskCreate) {
    const validData = Validation.validate(TaskValidation.CREATE, dto); // Assuming dto is already validated

    const { title, description, project_id, assigned_id } = validData;

    const task = await prisma.task.create({
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

  static async update(dto: TaskUpdate) {
    const validData = Validation.validate(TaskValidation.UPDATE, dto);

    const { id, title, description, project_id, assigned_id, status } =
      validData;

    const isTaskExist = await prisma.task.findUnique({
      where: { id },
    });

    if (!isTaskExist) {
      throw new Error("Task not found");
    }

    const task = await prisma.task.update({
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

  static async delete(dto: TaskDelete) {
    const validData = Validation.validate(TaskValidation.DELETE, dto);

    const { id } = validData;

    const isTaskExist = await prisma.task.findUnique({
      where: { id },
    });

    if (!isTaskExist) {
      throw new Error("Task not found");
    }

    const task = await prisma.task.delete({
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

  static async findAll(filter: any) {
    const validData = Validation.validate(TaskValidation.FILTER, filter);

    const {
      project_id,
      assigned_id,
      status,
      search,
      page = defaultPage,
      limit = defaultLimit,
    } = validData;

    const where: Prisma.TaskWhereInput = {
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

    const tasks = await prisma.task.findMany({
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
      meta: formatPagination(page, limit, await prisma.task.count({ where })),
    };
  }

  static async analytics(projectId: string) {
    const result = await prisma.task.groupBy({
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
      if (row.status === "TODO") summary.todo = row._count;
      if (row.status === "IN_PROGRESS") summary.inProgress = row._count;
      if (row.status === "DONE") summary.done = row._count;
    }

    return summary;
  }
}

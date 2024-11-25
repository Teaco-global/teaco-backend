import { Request, Response } from "express";
import { InputProjectInterface, UserInterface } from "../../interfaces";
import { ColumnService, ProjectService, SprintService } from "../../services";
import { Authenticate } from "../../middlewares";
import { ProjectStatusEnum } from "../../enums";

export class ProjectController {
  public constructor() {}

  static async getAllProjects(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const projects = await new ProjectService().findAll({workspaceId: userWorkspace.workspaceId})

    return res.status(200).json({
      message: "Projects fetched successfully.",
      data: projects
    })
  }

  static async getSingleProject(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;

    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const project = await new ProjectService().findByPk(+projectId)
    return res.status(200).json({
      message: "Project fetched successfully.",
      data: project
    })
  }

  static async createProject(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body as InputProjectInterface;
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const project = await new ProjectService().create({
      workspaceId: userWorkspace.workspace.id,
      name: name,
      description: description,
      createdById: userWorkspace.id,
    });
    
    await new SprintService().create({
      projectId: project.id,
      workspaceId: userWorkspace.workspace.id,
      sprintCount: 1
    })

    return res.status(200).json({
      message: "Project created successfully.",
      data: project,
    });
  }

  static async markProjectComplete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const project = await new ProjectService().updateOne({ id: +id, input: {
      status: ProjectStatusEnum.COMPLETED,
      completedDate: new Date()
    }})

    return res.status(200).json({
      message: "Project marked completed",
      data: project
    })
  }

  static async deleteProject(req: Request, res: Response): Promise<Response> {
    const { id }  = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    await new ProjectService().deleteOne(+id);
    return res.status(200).json({
      message: "Project deleted.",
    });
  }
}

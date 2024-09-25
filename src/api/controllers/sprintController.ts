import { Request, Response } from "express";
import { Authenticate } from "../../middlewares";
import { UserInterface } from "../../interfaces";
import { SprintService } from "../../services";
import { ProjectService } from "../../services";
import { SprintStatusEnum } from "../../enums";

export class SprintController {
  public constructor() {}

  static async createSprint(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;
    const { goal } = req.body;
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const project = await new ProjectService().findByPk(+projectId);
    const startDate = new Date();
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + project.sprintDuration * 7);
    const sprints = await new SprintService().findAll({workspaceId: userWorkspace.workspace.id, projectId: +projectId})

    const maxSprintCount = sprints.reduce((max, sprint) => Math.max(max, sprint.sprintCount), 0);

    const sprint = await new SprintService().create({
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId,
      sprintCount: maxSprintCount + 1,
      goal: goal,
    });

    return res.status(200).send({
      message: "Sprint created successfully.",
      data: sprint
    });
  }

  static async startSprint(req: Request, res: Response): Promise<Response> {
    const {projectId, sprintId} = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const project = await new ProjectService().findByPk(+projectId);
    const sprints = await new SprintService().findAll({
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId
    })
    sprints.forEach((sprint) => {
      if (sprint.status === SprintStatusEnum.STARTED && sprint.id !== +sprintId) {
        throw new Error('Please complete the ongoing sprint to start the new sprint');
      }
    });
    const startDate = new Date();
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + project.sprintDuration * 7);
    const sprint = await new SprintService().updateOne({
      id: +sprintId, 
      input: {
        startDate: startDate,
        dueDate: dueDate,
        status: SprintStatusEnum.STARTED
      }
    })

    return res.status(200).send({
      message: "Sprint started successfully.",
      data: sprint
    });
  }

  static async endSprint(req: Request, res: Response): Promise<Response> {
    const {projectId, sprintId} = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    await new SprintService().updateOne({
      id: +sprintId, 
      input: {
        completedDate: new Date(),
        status: SprintStatusEnum.COMPLETED
      }
    })

    const sprint = await new SprintService().findByPk(sprintId)

    return res.status(200).send({
      message: "Sprint ended successfully.",
      data: sprint
    });
  }

  static async currentSprint(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const sprint = await new SprintService().findOne({ status: SprintStatusEnum.STARTED || SprintStatusEnum.OVERDUED, projectId: +projectId })

    if (!sprint) {
      return res.status(200).send({
        message: "No sprint has been started.",
      });
    }

    return res.status(200).send({
      message: "Current sprint fetched successfully.",
      data: sprint
    });
  }

  static async allSprints(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );


    const sprints = await new SprintService().findAll({
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId
    })
    return res.status(200).send({
      message: "All sprints fetched successfully.",
      data: sprints
    });
  }
}

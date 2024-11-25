import { Request, Response } from "express";
import { Authenticate } from "../../middlewares";
import { UserInterface } from "../../interfaces";
import { SprintService } from "../../services";
import { SprintStatusEnum } from "../../enums";

export class SprintController {
  public constructor() {}

  static async createSprint (req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { projectId } = req.params
    const createdSprintExists = await new SprintService().findOne({ projectId: +projectId, status: SprintStatusEnum.CREATED })
    if ( createdSprintExists ) throw new Error(`Please start and complete the SPRINT ${createdSprintExists.sprintCount} to start the new sprint.`)
    const lastSprint = await new SprintService().findLastSprint({ projectId: +projectId })
    const sprint = await new SprintService().create({
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId,
      sprintCount: lastSprint.sprintCount + 1
    })


    return res.status(200).send({
      message: "Sprint started successfully.",
      data: sprint
    })
  }

  static async startSprint(req: Request, res: Response): Promise<Response> {
    const {projectId, sprintId} = req.params
    const {dueDate, goal} = req.body
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const startedSprintExists = await new SprintService().findOne({ status: SprintStatusEnum.STARTED, projectId: +projectId })
    if (startedSprintExists) throw new Error(`Please complete the SPRINT ${startedSprintExists.sprintCount} to start the new sprint.`)

    const sprint = await new SprintService().updateOne({
      id: +sprintId, 
      input: {
        goal: goal,
        startDate: new Date(),
        dueDate: new Date(dueDate),
        status: SprintStatusEnum.STARTED
      }
    })

    await new SprintService().create({
      projectId: +projectId,
      workspaceId: userWorkspace.workspace.id,
      sprintCount: sprint.sprintCount + 1
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
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const startedSprintExists = await new SprintService().findByPk(+sprintId)

    if (startedSprintExists.status != SprintStatusEnum.STARTED || SprintStatusEnum.OVERDUED) throw new Error(`The sprint is in "${startedSprintExists.status}" state.`)

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

  static async activeSprint(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const sprint = await new SprintService().findOne({ status: SprintStatusEnum.STARTED, projectId: +projectId })

    return res.status(200).send({
      message: "Active sprint fetched successfully.",
      data: sprint
    });
  }

  static async createdSprint(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const sprint = await new SprintService().findOne({
      status: SprintStatusEnum.CREATED,
      projectId: +projectId
    })
    return res.status(200).send({
      message: "Created sprint fetched successfully.",
      data: sprint
    });
  }
}

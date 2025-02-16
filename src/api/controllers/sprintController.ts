import { Request, Response } from "express";
import { Authenticate } from "../../middlewares";
import { UserInterface } from "../../interfaces";
import { IssueService, SprintService } from "../../services";
import { SprintStatusEnum } from "../../enums";

export class SprintController {
  public constructor() {}

  static async createSprint(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { projectId } = req.params;
    const createdSprintExists = await new SprintService().findOne({
      projectId: +projectId,
      status: SprintStatusEnum.CREATED,
    });
    if (createdSprintExists)
      throw new Error(
        `Please start and complete the SPRINT ${createdSprintExists.sprintCount} to start the new sprint.`
      );
    const lastSprint = await new SprintService().findLastSprint({
      projectId: +projectId,
    });
    const sprint = await new SprintService().create({
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId,
      sprintCount: lastSprint.sprintCount + 1,
    });

    return res.status(200).send({
      message: "Sprint started successfully.",
      data: sprint,
    });
  }

  static async startSprint(req: Request, res: Response): Promise<Response> {
    try {
      const { projectId, sprintId } = req.params;
      const { dueDate, goal } = req.body;
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      if (new Date(dueDate) < new Date()) {
        return res.status(400).json({
          message: 'Sprint due date must be in the future.' 
        });
      }
      const startedSprintExists = await new SprintService().findOne({
        status: SprintStatusEnum.STARTED,
        projectId: +projectId,
      });
      if (startedSprintExists) {
        return res.status(400).json({
          message: `Please complete the SPRINT ${startedSprintExists.sprintCount} to start the new sprint.`
        })
      }
      const sprintExists = await new SprintService().findByPk(+sprintId)
      if (sprintExists.issues.length < 1) {
        return res.status(400).json({
          message: `Sprint cannot be started because it has 0 issues`
        })
      }

      const sprint = await new SprintService().updateOne({
        id: +sprintId,
        input: {
          goal: goal,
          startDate: new Date(),
          dueDate: new Date(dueDate),
          status: SprintStatusEnum.STARTED,
        },
      });

      await new SprintService().create({
        projectId: +projectId,
        workspaceId: userWorkspace.workspace.id,
        sprintCount: sprint.sprintCount + 1,
      });

      return res.status(200).send({
        message: "Sprint started successfully.",
        data: sprint,
      });
    } catch (error) {
      console.error("Error ending sprint:", error);
      return res.status(500).json({
        message: "An error occurred while trying to end the sprint.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async endSprint(req: Request, res: Response): Promise<Response> {
    try {
      const { projectId, sprintId } = req.params;
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;

      await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );
      const activeSprint = await new SprintService().findByPk(+sprintId);
      if (!activeSprint) {
        return res.status(404).json({ message: "Sprint not found." });
      }

      if (
        activeSprint.status === SprintStatusEnum.CREATED ||
        activeSprint.status === SprintStatusEnum.COMPLETED
      ) {
        return res.status(400).json({
          message: `The sprint is in "${activeSprint.status}" state and cannot be ended.`,
        });
      }

      const activeSprintIssues =
        await new IssueService().findAllActiveSprintIssues({
          sprintId: activeSprint.id,
          projectId: +projectId,
        });

      const allIssuesInDoneColumn = activeSprintIssues.every(
        (issue) => issue.columnId === 4
      );

      if (!allIssuesInDoneColumn) {
        return res.status(400).json({
          message:
            'All issues must be in the "DONE" column for the sprint to end.',
        });
      }

      await new SprintService().updateOne({
        id: +sprintId,
        input: {
          completedDate: new Date(),
          status: SprintStatusEnum.COMPLETED,
        },
      });

      const updatedSprint = await new SprintService().findByPk(+sprintId);
      return res.status(200).json({
        message: "Sprint ended successfully.",
        data: updatedSprint,
      });
    } catch (error) {
      console.error("Error ending sprint:", error);
      return res.status(500).json({
        message: "An error occurred while trying to end the sprint.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async activeSprint(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const sprint = await new SprintService().findOne({
      status: SprintStatusEnum.STARTED,
      projectId: +projectId,
    });
    
    return res.status(200).send({
      message: "Active sprint fetched successfully.",
      data: sprint,
    });
  }

  static async createdSprint(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const sprint = await new SprintService().findOne({
      status: SprintStatusEnum.CREATED,
      projectId: +projectId,
    });
    return res.status(200).send({
      message: "Created sprint fetched successfully.",
      data: sprint,
    });
  }

  static async backlogIssues(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const sprint = await new IssueService().findBacklogIssues({
      projectId: +projectId,
    });
    return res.status(200).send({
      message: "Backlog issues fetched successfully.",
      data: sprint,
    });
  }
}

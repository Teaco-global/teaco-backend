import { Request, Response } from "express";
import { UserInterface } from "../../interfaces";
import { Authenticate } from "../../middlewares";
import { IssueService } from "../../services";

export class IssueController {
  public constructor() {}

  static async createIssue(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const { projectId } = req.params;
    const { type } = req.body;

    const issue = await new IssueService().create({
      type: type,
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId,
    });

    return res.status(200).json({
      message: "Issue type created successfully.",
      data: issue,
    });
  }

  static async updateIssue(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const { projectId, issueId } = req.params;
    const { type } = req.body;

    const issue = await new IssueService().create({
      type: type,
      workspaceId: userWorkspace.workspace.id,
      projectId: +projectId,
    });

    return res.status(200).json({
      message: "Issue type updated successfully.",
      data: issue,
    });
  }

  static async removeIssue(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const { issueId } = req.params

    await new IssueService().deleteOne(+issueId)

    return res.status(200).json({
        message: "Issue type removed successfully.",
    });
  }

  static async getAllIssuesType(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );
    const { projectId } = req.params
    const issues = await new IssueService().findAll({workspaceId: userWorkspace.workspace.id, projectId: +projectId})
    return res.status(200).json({
        message: "Issue type removed successfully.",
        data: issues
    });
  }
}

import { Request, Response } from "express";
import { InputIssueInterface, UserInterface } from "../../interfaces";
import { Authenticate } from "../../middlewares";
import { ColumnService, IssueService } from "../../services";

export class IssueController {
  public constructor() {}

  static async createIssue(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { projectId } = req.params;
    const { type, title, parentId, description, sprintId } = req.body;
    let { columnId } = req.body;
    if (!columnId) {
      columnId = 1 //TODO: replace this hardcode value
    }
    let issue 
    try{
      issue = await new IssueService().create({
        type: type,
        workspaceId: userWorkspace.workspace.id,
        projectId: +projectId,
        title: title,
        parentId: parentId,
        createdById: userWorkspace.id,
        columnId: columnId,
        description: description,
        sprintId: sprintId
      });
    } catch(err) {
      console.error(err)
    }

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
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { projectId, issueId } = req.params;
    const { type, title, description, status, columnId, sprintId } = req.body;

    const updateFields: Partial<InputIssueInterface> = {
      type,
      title,
      description,
      status,
      columnId,
      sprintId,
    };

    const updatedIssue = await new IssueService().updateOne({
      id: Number(issueId),
      input: updateFields,
    });

    return res.status(200).json({
      message: "Issue type updated successfully.",
      data: updatedIssue,
    });
  }

  static async removeIssue(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { issueId } = req.params;

    await new IssueService().deleteOne(+issueId);

    return res.status(200).json({
      message: "Issue type removed successfully.",
    });
  }
}

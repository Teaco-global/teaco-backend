import { Request, Response } from "express";
import { Authenticate, Validator } from "../../middlewares";
import { workspaceLogin } from "../../validators";
import { UserInterface, WorkspaceInterface } from "../../interfaces";
import { UsersService, UserWorkspaceService } from "../../services";

export class UserWorkspaceController {
  public constructor() {}

  static async activeWorkspaces(req: Request, res: Response): Promise<Response> {
    const user = (await Authenticate.verifyAccessToken(req.headers.authorization)).data as UserInterface;
    const userWorkspace = await new UserWorkspaceService().findOne({userId: user.id})

    return res.status(200).json({
      message: "Active workspaces fetched.",
      data: {
        workspace: {
          id: userWorkspace.workspace.id,
          label: userWorkspace.workspace.label
        }
      }
    })
  }

  static async workspaceLogin(req: Request, res: Response): Promise<Response> {
    const { workspaceId } = req.body;
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    Validator.check(workspaceLogin, { workspaceId });

    const userWorkspace = await new UserWorkspaceService().findOne({
      workspaceId: workspaceId,
    });

    if (!userWorkspace) throw new Error("Invalid workspace");

    const workspace = userWorkspace.workspace as WorkspaceInterface;

    return res.status(200).json({
      message: "Workspace login successfull.",
      data: {
        token: workspace.secret,
      },
    });
  }

  static async inviteWorkspaceMember(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"],
      user.id
    );

    const { name, email, role } = req.body;


    const newUser = await new UsersService().create({name: name, email: email, password: "Password@123"});
    const newUserWorkspace = await new UserWorkspaceService().create({ userId: newUser.id, workspaceId: userWorkspace.workspace.id, role })
    return res.status(200).json({
      message: "Member invited successfull.",
    });
  }
}

import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { Authenticate, Validator } from "../../middlewares";
import { workspaceLogin } from "../../validators";
import { UserInterface, WorkspaceInterface } from "../../interfaces";
import {
  UsersService,
  UserWorkspaceRoleService,
  UserWorkspaceService,
  WorkspaceService,
} from "../../services";
import {
  pgMinLimit,
  pgMaxLimit,
  defaultOrder,
  defaultSort,
  saltRound,
} from "../../config";
import { Helper } from "../../helpers/invite";
import { UsersStatusEnum, UserWorkspaceStatusEnum } from "../../enums";

export class UserWorkspaceController {
  public constructor() {}

  static async activeWorkspaces(
    req: Request,
    res: Response
  ): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await new UserWorkspaceService().findOne({
      userId: user.id,
    });

    return res.status(200).json({
      message: "Active workspaces fetched.",
      data: {
        workspace: {
          id: userWorkspace.workspace.id,
          label: userWorkspace.workspace.label,
        },
      },
    });
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

  static async inviteWorkspaceMember(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const { name, email, role } = req.body;

      const userExists = await new UsersService().findOne({ email: email });
      if (userExists) {
        const userWorkspaceExists = await new UserWorkspaceService().findOne({
          userId: userExists.id,
          workspaceId: userWorkspace.workspace.id,
        });
        if (userWorkspaceExists) {
          if (userWorkspaceExists.status === UserWorkspaceStatusEnum.ACCEPTED)
            return res.status(400).json({
              message: `User is already associated to this workspace`,
            });
          await Helper.sendInvitationLink({
            userWorkspace: userWorkspaceExists,
            email: email,
          });
          return res.status(200).json({
            message: "Member re-invited successfully.",
          });
        }
        const newUserWorkspace = await new UserWorkspaceService().create({
          userId: userExists.id,
          workspaceId: userWorkspace.workspace.id,
          role,
        });
        await Helper.sendInvitationLink({
          userWorkspace: newUserWorkspace,
          email: email,
        });

        return res.status(200).json({
          message: "Member invited successfully.",
        });
      }

      const newUser = await new UsersService().create({
        name: name,
        email: email,
        password: "Password@123",
      });
      const newUserWorkspace = await new UserWorkspaceService().create({
        userId: newUser.id,
        workspaceId: userWorkspace.workspace.id,
        role,
      });
      await Helper.sendInvitationLink({
        userWorkspace: newUserWorkspace,
        email: email,
      });

      return res.status(200).json({
        message: "Member invited successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while inviting the member.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async acceptMemberInvite(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { token, password, accept } = req.body;

      const identityVerification = await Helper.verifyToken(token);
      if (!identityVerification) {
        return res.status(400).json({
          message: "Invalid token",
        });
      }

      const userWorkspaceExists = await new UserWorkspaceService().findOne({
        identity: identityVerification?.identity,
      });
      const workspaceExists = await new WorkspaceService().findByPk(
        userWorkspaceExists.workspaceId
      );
      const userExists = await new UsersService().findByPk(
        userWorkspaceExists.userId
      );

      if (!userWorkspaceExists || !userExists || !workspaceExists) {
        return res.status(400).json({
          message: "Invalid token",
        });
      }

      await new UserWorkspaceService().updateOne(userWorkspaceExists.id, {
        status: accept
          ? UserWorkspaceStatusEnum.ACCEPTED
          : UserWorkspaceStatusEnum.PENDING,
      });

      if (password) {
        await new UsersService().updateOne({
          id: userExists.id,
          input: {
            password: await bcrypt.hash(password, saltRound),
            status: UsersStatusEnum.VERFIED,
          },
        });
      }

      return res.status(200).json({
        message: "Invitation accepted.",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "An error occurred while accepting the invite.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async removeWorkspaceMember(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const { userWorkspaceId } = req.body;

      if (userWorkspaceId === userWorkspace.id) {
        return res.status(400).json({
          message: "You cannot remove yourself",
        });
      }

      const userWorkspaceRole = await new UserWorkspaceRoleService().findOne({
        userWorkspaceId,
      });
      if (userWorkspaceRole.role.slug === "owner")
        return res.status(400).json({
          message:
            "You don't have privilege to remove the owner of the workspace.",
        });

      await new UserWorkspaceService().deleteOne({
        id: userWorkspaceId,
      });

      return res.status(200).json({
        message: "Workspace member removed successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "An error occurred while deleting the workspace member.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async workspaceMembers(
    req: Request,
    res: Response
  ): Promise<Response> {
    let { offset, limit, order, sort } = req.query as any;

    offset = Number(offset) && Number(offset) > 0 ? Number(offset) - 1 : 0;
    limit = limit ? limit : pgMinLimit;
    limit = Math.min(limit, pgMaxLimit);
    order = order ? order : defaultOrder;
    sort = sort ? sort : defaultSort;

    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { rows, count } = await new UserWorkspaceService().findAndCountAll({
      offset,
      limit,
      order,
      sort,
      workspaceId: userWorkspace.workspace.id,
    });

    return res.status(200).json({
      message: "Workspace members fetched successfully",
      data: rows,
      count,
    });
  }

  static async activeWorkspaceMembers(
    req: Request,
    res: Response
  ): Promise<Response> {
    let { offset, limit, order, sort } = req.query as any;

    offset = Number(offset) && Number(offset) > 0 ? Number(offset) - 1 : 0;
    limit = limit ? limit : pgMinLimit;
    limit = Math.min(limit, pgMaxLimit);
    order = order ? order : defaultOrder;
    sort = sort ? sort : defaultSort;

    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const { rows, count } = await new UserWorkspaceService().findAndCountAll({
      offset,
      limit,
      order,
      sort,
      workspaceId: userWorkspace.workspace.id,
      status: UserWorkspaceStatusEnum.ACCEPTED
    });

    return res.status(200).json({
      message: "Active workspace members fetched successfully",
      data: rows,
      count,
    });
  }
}

import { Request, Response } from "express";
import { Authenticate } from "../../middlewares";
import { UserInterface } from "../../interfaces";
import { ColumnService } from "../../services";

export class ColumnsController {
  public constructor() {}

  static async getColumns(req: Request, res: Response): Promise<Response> {
    const user = (
      await Authenticate.verifyAccessToken(req.headers.authorization)
    ).data as UserInterface;
    const userWorkspace = await Authenticate.verifyWorkspace(
      req.headers?.["x-workspace-secret-id"] as string,
      user.id
    );

    const columns = await new ColumnService().findAll()

    return res.status(200).send({
      message: "Columns fetched successfully.",
      data: columns
    });
  }
}

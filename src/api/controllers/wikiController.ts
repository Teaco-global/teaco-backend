import { Request, Response } from "express";
import { UserInterface } from "../../interfaces";
import { Authenticate } from "../../middlewares";
import { WikiService, WikiUserWorkspaceService } from "../../services";
import { Ksuid } from "../../helpers";
import {
  defaultOrder,
  defaultSort,
  pgMaxLimit,
  pgMinLimit,
} from "../../config";

export class WikiController {
  public constructor() {}

  static async createWiki(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const wiki = await new WikiService().create({
        identity: `WI-${Ksuid.generate()}`,
        workspaceId: userWorkspace.workspaceId,
        createdById: userWorkspace.id,
        updatedById: userWorkspace.id,
      });

      await new WikiUserWorkspaceService().create({
        wikiId: wiki.id,
        workspaceId: userWorkspace.workspaceId,
        userWorkspaceId: userWorkspace.id
      })

      return res.status(200).json({
        message: "Wiki created successfully.",
        data: wiki,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "An unknown error occured.",
        error: error,
      });
    }
  }
  static async getWiki(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const { wikiId } = req.params
      console.log(wikiId)
      const wiki = await new WikiService().findByPk(+wikiId)

      return res.status(200).json({
        message: "Wiki fetched successfully.",
        data: wiki
      })
    } catch (error: any) {
      return res.status(500).json({
        message: "An unknown error occured.",
        error: error,
      });
    }
  }
  static async updateWiki(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      console.log(req.params)

      const { wikiId } = req.params;
      const { title, content } = req.body;

      const wiki = await new WikiService().updateOne({
        id: Number(wikiId),
        input: {
          title: title,
          content: content,
        },
      });

      return res.status(200).json({
        message: "Wiki updated successfully.",
        data: wiki,
      });
    } catch (error: any) {
      console.log(error)
      return res.status(500).json({
        message: "An unknown error occured.",
        error: error,
      });
    }
  }
  static async deleteWiki(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );
      const { wikiId } = req.params;
      await new WikiService().deleteOne(+wikiId);
      return res.status(200).json({
        message: "Wiki deleted successfully.",
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "An unknown error occured.",
        error: error,
      });
    }
  }
  static async getAllWikis(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      let { offset, limit, order, sort } = req.query as any;

      offset = Number(offset) && Number(offset) > 0 ? Number(offset) - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;

      const { rows, count } =
        await new WikiUserWorkspaceService().findAndCountAll({
          offset,
          limit,
          order,
          sort,
          workspaceId: userWorkspace.workspaceId,
        });
      
      return res.status(200).json({
        message: "Wikis fetched successfully.",
        data: rows,
        count,
      });
    } catch (error: any) {
      console.log(error)
      return res.status(500).json({
        message: "An unknown error occured.",
        error: error,
      });
    }
  }
  static async shareWiki(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );
    } catch (error: any) {
      return res.status(500).json({
        message: "An unknown error occured.",
        error: error,
      });
    }
  }
}

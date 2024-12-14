import { Request, Response } from "express";
import { InputRoomInterface, UserInterface } from "../../interfaces";
import { Authenticate } from "../../middlewares";
import { MessageService, RoomService, RoomUserWorkspaceService } from "../../services";
import { Ksuid } from "../../helpers";
import { RoomTypeEnum } from "../../enums";
import { defaultOrder, defaultSort, pgMaxLimit, pgMinLimit } from "../../config";

export class ChatController {
  public constructor() {}

  static async createRoom(req: Request, res: Response): Promise<Response> {
    try {
      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const { receiverId } = req.body;

      if (userWorkspace.id === receiverId) {
        return res.status(400).json({
          message: "You cannot create room with yourself.",
        });
      }

      const results = await new RoomService().query({
        workspaceId: userWorkspace.workspace.id,
        userWorkspaceId: userWorkspace.id,
        receiverId: receiverId,
      });

      if (results.length === 2) {
        const roomIds = results.map((item: any) => {
          return item.room_id;
        });

        const roomDetails = await new RoomService().findByPk(roomIds[0]);
        return res.status(200).json({
          message: "Room is already available",
          data: roomDetails,
        });
      } else {
        const data = await new RoomService().create({
          identity: `RM-${Ksuid.generate()}`,
          type: RoomTypeEnum.couple,
          isPublic: false,
          createdById: userWorkspace.id,
          updatedById: userWorkspace.id,
        });

        const userWorkspaceIds = [userWorkspace.id, receiverId];

        userWorkspaceIds.map(async (item: number) => {
          await new RoomUserWorkspaceService().create({
            roomId: data.id,
            workspaceId: userWorkspace.workspaceId,
            userWorkspaceId: item,
          });
        });

        return res.status(200).send({
          message: "Room created successfully.",
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        message: "An error occurred while creating a chat room.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async sendMessage(req: Request, res: Response): Promise<Response> {
    try {

      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const { roomId, senderId, body } = req.body
      const room = await new RoomService().findByPk(roomId);
      const message = await new MessageService().create({
        roomId,
        workspaceId: userWorkspace.workspace.id,
        senderId,
        body
      });
      return res.status(200).send({
        message: "Message sent.",
        data: message
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "An error occurred while sending a message.",
        error: error.message || "Unexpected error.",
      });
    }
  }

  static async getMessages(req: Request, res: Response): Promise<Response> {
    try {

      const user = (
        await Authenticate.verifyAccessToken(req.headers.authorization)
      ).data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        req.headers?.["x-workspace-secret-id"] as string,
        user.id
      );

      const { roomId } = req.params;
      let { offset, limit, order, sort } = req.query as any;

      offset = Number(offset) && Number(offset) > 0 ? Number(offset) - 1 : 0;
      limit = limit ? limit : pgMinLimit;
      limit = Math.min(limit, pgMaxLimit);
      order = order ? order : defaultOrder;
      sort = sort ? sort : defaultSort;

      const {rows, count} = await new MessageService().findAndCountAll({
        offset: offset,
        limit: limit,
        sort: sort,
        order: order,
        workspaceId: userWorkspace.workspaceId,
        roomId: Number(roomId)
      })

      return res.status(200).send({
        message: "Messages fetched.",
        data: rows
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "An error occurred while getting messages.",
        error: error.message || "Unexpected error.",
      });
    }
  }
}

import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Database, baseUrl, port } from "./config";
import morgan from "morgan";
import { ProxyRouter } from "./api/routes";
import cors from "cors";
import { UserInterface } from "./interfaces";
import { Authenticate } from "./middlewares";
import { MessageService } from "./services";

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-workspace-secret-id",
  ],
  credentials: true,
};

class Server {
  private app: express.Application;
  private httpServer: ReturnType<typeof createServer>;
  private io: SocketIOServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "x-workspace-secret-id",
        ],
        credentials: true,
      },
    });

    this.configuration();
    this.initializeSocketEvents();
  }

  private configuration() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use("/teaco/api/v1", ProxyRouter.map());
  }

  private initializeSocketEvents() {
    this.io.on("connection", async (socket) => {
      const token = socket.handshake.auth.token;
      const workspaceSecretId = socket.handshake.headers[
        "x-workspace-secret-id"
      ] as string;

      const user = (await Authenticate.verifyAccessToken(token))
        .data as UserInterface;
      const userWorkspace = await Authenticate.verifyWorkspace(
        workspaceSecretId,
        user.id
      );

      socket.on("send_message", async (messageData) => {
        try {
          const message = await new MessageService().create({
            roomId: messageData.roomId,
            workspaceId: userWorkspace.workspaceId,
            senderId: userWorkspace.id,
            body: messageData.body,
          });

          this.io.emit("new_message", {
            roomId: message.roomId,
            senderId: message.senderId,
            body: message.body,
            createdAt: message.createdAt,
          });
        } catch (error) {
          console.error("Message sending error:", error);
        }
      });
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  private async connect() {
    try {
      await Database.connection();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public start() {
    this.connect();
    this.httpServer.listen(port, () => {
      console.info(`Server started at ${baseUrl}:${port}`);
    });
  }
}

const server = new Server();
server.start();
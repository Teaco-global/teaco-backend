import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Authenticate } from "./middlewares";
import { MessageService } from "./services";
import { MessageInterface, UserInterface } from "./interfaces";

class SocketServer {
  private io: SocketIOServer;
  private httpServer: HttpServer;
  private static instance: SocketServer;

  static get(): SocketServer {
    if (!SocketServer.instance) SocketServer.instance = new SocketServer();
    return SocketServer.instance;
  }

  constructor() {
    this.httpServer = new HttpServer();
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "x-workspace-secret-id",
        ],
        credentials: true,
      },
    });

    this.initializeSocketEvents();
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
            createdAt: message.createdAt
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

  public start(port?: number) {
    const socketPort = port || 8001;

    this.httpServer.listen(socketPort, () => {
      console.info(`Socket server started on port ${socketPort}`);
    });

    return this.io;
  }
}

const socketServer = SocketServer.get();
export { socketServer as SocketServer };

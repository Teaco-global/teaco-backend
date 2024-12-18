import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { ChatController } from "../controllers";

export class ChatRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.route("/create-room").post(exceptionHandler(ChatController.createRoom));
    this.router.route("/create-channel").post(exceptionHandler(ChatController.createChannel));
    this.router.route("/send-message").post(exceptionHandler(ChatController.sendMessage));
    this.router.route("/get-messages").get(exceptionHandler(ChatController.getMessages));
    this.router.route("/assigned-channels").get(exceptionHandler(ChatController.assignedChannels));
  }
}

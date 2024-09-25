import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { AuthController, UserWorkspaceController } from "../controllers";

export class UserWorkspaceRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.route("/workspace-login").get(exceptionHandler(UserWorkspaceController.workspaceLogin));
    this.router.route("/active-workspaces").get(exceptionHandler(UserWorkspaceController.activeWorkspaces))
    this.router.route("invite-member").post(exceptionHandler(UserWorkspaceController.inviteWorkspaceMember))
  }
}

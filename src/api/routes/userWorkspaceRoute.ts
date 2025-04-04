import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { UserWorkspaceController } from "../controllers";

export class UserWorkspaceRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.route("/workspace-login").post(exceptionHandler(UserWorkspaceController.workspaceLogin));
    this.router.route("/active-workspaces").get(exceptionHandler(UserWorkspaceController.activeWorkspaces))
    this.router.route("/workspace-members").get(exceptionHandler(UserWorkspaceController.workspaceMembers))
    this.router.route("/workspace-members").get(exceptionHandler(UserWorkspaceController.workspaceMember))
    this.router.route("/active-workspace-members").get(exceptionHandler(UserWorkspaceController.activeWorkspaceMembers))
    this.router.route("/invite-member").post(exceptionHandler(UserWorkspaceController.inviteWorkspaceMember))
    this.router.route("/accept-invite").put(exceptionHandler(UserWorkspaceController.acceptMemberInvite))
    this.router.route("/remove-member").delete(exceptionHandler(UserWorkspaceController.removeWorkspaceMember))
  }
}

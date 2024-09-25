import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { IssueController, SprintController } from "../controllers";

export class IssueRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.route("/:projectId").post(exceptionHandler(IssueController.createIssue));
    this.router.route("/:projectId/:issueId").put(exceptionHandler(IssueController.updateIssue));
    this.router.route("/:projectId/:issueId").delete(exceptionHandler(IssueController.removeIssue));
    this.router.route("/:projectId/:issueId").get(exceptionHandler(SprintController.currentSprint))
    this.router.route("/:projectId").get(exceptionHandler(SprintController.allSprints))
  }
}

import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { SprintController } from "../controllers";

export class SprintRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.route("/:projectId/").post(exceptionHandler(SprintController.createSprint));
    this.router.route("/:projectId/:sprintId/start").put(exceptionHandler(SprintController.startSprint));
    this.router.route("/:projectId/:sprintId/end").put(exceptionHandler(SprintController.endSprint));
    this.router.route("/:projectId/current-sprint").get(exceptionHandler(SprintController.currentSprint))
    this.router.route("/:projectId/all-sprints").get(exceptionHandler(SprintController.allSprints))
  }
}

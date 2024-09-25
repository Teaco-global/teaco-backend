import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { ProjectController } from "../controllers";

export class ProjectRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router
      .route("/create")
      .post(exceptionHandler(ProjectController.createProject));
      
    this.router
      .route(`/:id`)
      .delete(exceptionHandler(ProjectController.deleteProject));

    this.router
      .route(`/mark-complete/:id`)
      .put(exceptionHandler(ProjectController.markProjectComplete));

    this.router
      .route(`/`)
      .get(exceptionHandler(ProjectController.getAllProjects));

    this.router
      .route(`/:id`)
      .get(exceptionHandler(ProjectController.getSingleProject));
  }
}

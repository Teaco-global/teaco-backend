import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { ColumnsController, IssueController, ProjectController, SprintController } from "../controllers";

export class ProjectRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    // Projects
    this.router.route("/create").post(exceptionHandler(ProjectController.createProject)); // Create a project
    this.router.route("/:projectId").get(exceptionHandler(ProjectController.getSingleProject)); // Get a single project
    this.router.route("/:projectId").delete(exceptionHandler(ProjectController.deleteProject)); // Delete a project
    this.router.route("/:projectId/mark-complete").put(exceptionHandler(ProjectController.markProjectComplete)); // Mark project as complete
    this.router.route("/").get(exceptionHandler(ProjectController.getAllProjects)); // Get all projects

    // Sprints
    this.router.route("/:projectId/sprints/created").get(exceptionHandler(SprintController.createdSprint)); // Get all sprints for a project
    this.router.route("/:projectId/sprints/active").get(exceptionHandler(SprintController.activeSprint)); // Get active sprint for a project
    this.router.route("/:projectId/sprints/").post(exceptionHandler(SprintController.createSprint)); // Create a sprint for a project
    this.router.route("/:projectId/sprints/:sprintId/start").put(exceptionHandler(SprintController.startSprint)); // Start a sprint
    this.router.route("/:projectId/sprints/:sprintId/end").put(exceptionHandler(SprintController.endSprint)); // End a sprint

    // Columns
    this.router.route("/:projectId/columns").get(exceptionHandler(ColumnsController.getColumns)); // Get all columns for a project

    // Issues
    this.router.route("/:projectId/issues").post(exceptionHandler(IssueController.createIssue)); // Create an issue for a project
    this.router.route("/:projectId/issues/:issueId").put(exceptionHandler(IssueController.updateIssue)); // Update an issue
    this.router.route("/:projectId/issues/:issueId").delete(exceptionHandler(IssueController.removeIssue)); // Delete an issue
  }
}

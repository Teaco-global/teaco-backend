import { Router } from "express";
import { IrouteInteface } from "../../interfaces/IRouteInterface";
import { AuthRoute } from "./authRoute";
import { UserWorkspaceRoute } from "./userWorkspaceRoute";
import { ProjectRoute } from "./projectRoute";
import { SprintRoute } from "./sprintRoute";
import { IssueRoute } from "./issueRoute";

class ProxyRouter {
  private static instance: ProxyRouter;
  private router: Router = Router();

  private readonly routes = [
    {
      segment: "/auth",
      provider: AuthRoute,
    },
    {
      segment: "/user-workspace",
      provider: UserWorkspaceRoute,
    },
    {
      segment: "/project",
      provider: ProjectRoute,
    },
    {
      segment: "/sprint",
      provider: SprintRoute,
    },
    {
        segment: "/issue",
        provider: IssueRoute
    }
  ];

  private constructor() {}

  static get(): ProxyRouter {
    if (!ProxyRouter.instance) ProxyRouter.instance = new ProxyRouter();

    return ProxyRouter.instance;
  }

  map(): Router {
    this.routes.forEach((route: IrouteInteface) => {
      const instance = new route.provider() as { router: Router };
      this.router.use(route.segment, instance.router);
    });

    return this.router;
  }
}

const proxyRouter = ProxyRouter.get();
export { proxyRouter as ProxyRouter };

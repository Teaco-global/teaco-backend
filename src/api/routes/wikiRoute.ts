import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { WikiController } from "../controllers";

export class WikiRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    this.router.route("/").post(exceptionHandler(WikiController.createWiki));
    this.router.route("/:wikiId").get(exceptionHandler(WikiController.getWiki));
    this.router.route("/:wikiId").put(exceptionHandler(WikiController.updateWiki)); // pass content, body and identity of the wiki. We get identity of wiki after we create the wiki
    this.router.route("/:wikiId").delete(exceptionHandler(WikiController.deleteWiki));
    this.router.route("/").get(exceptionHandler(WikiController.getAllWikis)); // pass offset, limit, order and sort for pagination
    // this.router.route("/:wikiId/share").delete(exceptionHandler(WikiController.shareWiki));
  }
}

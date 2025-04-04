import exceptionHandler from "../../middlewares/exceptionHandler";
import { RouterClass } from "../classes";
import { AuthController } from "../controllers";

export class AuthRoute extends RouterClass {
  constructor() {
    super();
  }

  define(): void {
    // Define routes for authentication operations
    this.router
      .route("/sign-up")
      .post(exceptionHandler(AuthController.signUp));

    this.router
      .route("/verify-account")
      .post(exceptionHandler(AuthController.verifyAccount));

    this.router
      .route("/resend-verification-code")
      .post(exceptionHandler(AuthController.resendVerificationCode));

    this.router
      .route("/login")
      .post(exceptionHandler(AuthController.login));

    this.router
      .route("/me")
      .get(exceptionHandler(AuthController.authMe));
  }
}
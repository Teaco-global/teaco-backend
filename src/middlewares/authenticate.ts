import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

import { accessTokenExpiresIn, jwtClientSecret } from "../config";
import { WorkspaceService } from "../services/workspaceService";
import { UserWorkspaceService } from "../services";

class Authenticate {
  private static instance: Authenticate;
  constructor() {}

  public static get(): Authenticate {
    if (!Authenticate.instance) Authenticate.instance = new Authenticate();

    return Authenticate.instance;
  }

  public async generateAcessToken(payload) {
    const options: SignOptions = {
      expiresIn: accessTokenExpiresIn,
      algorithm: "HS512"
    };

    return jwt.sign(
      { id: payload.id, email: payload.email, name: payload.name },
      jwtClientSecret,
      options
    );
  }

  public async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, jwtClientSecret);
      return { success: true, data: decoded };
    } catch (error) {
      console.error(`${error.name}`)
      throw new Error(error)
    }
  }

  public async verifyWorkspace(secret: string, userId: number) {
    try {
      if (!secret) throw new Error()
      const workspace = await new WorkspaceService().findBySecret({secret: secret})

      if(!workspace) throw new Error('Workspace does not exists.');

      const userWorkspace = await new UserWorkspaceService().findOne({userId: userId, workspaceId: workspace.id})
      
      return userWorkspace
    } catch (error) {
      throw new Error(`Invalid or missing workspace secret`)
    }
  }

}

const authenticate = Authenticate.get();
export { authenticate as Authenticate };

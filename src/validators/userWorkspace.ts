import Joi from "joi";
import { joiSchema } from "./schema";

const workspaceLogin = Joi.object({
  workspaceId: joiSchema.numberSchema.label("Workspace Id").required(),
});

export { workspaceLogin };

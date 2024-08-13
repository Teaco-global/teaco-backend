import Joi from "joi";

export const joiSchema = {
  stringSchame: Joi.string(),
  numberSchema: Joi.number(),
  objectSchema: Joi.object(),
  booleanSchema: Joi.boolean(),
  arraySchema: Joi.array(),
  dateAndTimeSchema : Joi.date(), 
  emailSchema: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: [], deny: [] } })
    .lowercase()
    .trim(),
};

import Joi, { ArraySchema, NumberSchema, ObjectSchema, StringSchema } from "joi";

class Validator {
    private static instance: Validator

    public constructor () {}

    static get(): Validator {
        if(!Validator.instance) Validator.instance = new Validator();
        return Validator.instance;
    }

    check = (schema: ObjectSchema | ArraySchema | StringSchema | NumberSchema, input: string | object) => {
        const { value, error } = schema.validate(input, {
            abortEarly: false
        });
        if (error) throw error
    }
}

const validator = Validator.get();

export { validator as Validator }
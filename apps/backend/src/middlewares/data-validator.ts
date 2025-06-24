import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { BadRequestError } from "../errors/common.error";
import _ from "lodash";


const dataValidator =
    (schema: Joi.ObjectSchema) => (req: Request, _res: Response, next: NextFunction) => {
        const keys = Object.keys(schema.describe().keys);
        console.log("Validating request data with keys:", keys);
        
        const { error } = schema.validate(_.pick(req, keys), { abortEarly: false });
        if (error) {
        
            const errorMessages = error.details.map((detail) => detail.message);

            next(
                new BadRequestError(errorMessages.join(", "))
            );
        }
        next();
    };

  export default dataValidator;
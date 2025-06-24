import status from "http-status";
import BaseError from "./base.error";

export class NotFoundError extends BaseError {
 constructor(description: string) {
        super(status[404], status.NOT_FOUND, description, true);
    }
}

export class BadRequestError extends BaseError {
    constructor(description: string) {
        super(status[400], status.BAD_REQUEST, description, true);
    }
}

import BaseError from "./base.error";
import { status } from "http-status";

export class UnauthorizedError extends BaseError {
    constructor(description: string) {
        super(status[401], status.UNAUTHORIZED, description, true);
    }
}

export class ForbiddenError extends BaseError {
    constructor(description: string) {
        super(status[403], status.FORBIDDEN, description, true);
    }
}
export class UserAlreadyExistsError extends BaseError {
    constructor(description: string) {
        super(status[409], status.CONFLICT, description, true);
    }
}
export class UserNotActiveError extends BaseError {
    constructor(description: string) {
        super(status[403], status.FORBIDDEN, description, true);
    }
}

export class PasswordsDoNotMatchError extends BaseError {
    constructor(description: string) {
        super(status[400], status.BAD_REQUEST, description, true);
    }
}

export class TokenExpiredError extends BaseError {
    constructor(description: string) {
        super(status[401], status.UNAUTHORIZED, description, true);
    }
}

export class UserIsVerifiedError extends BaseError {
    constructor(description: string) {
        super(status[400], status.BAD_REQUEST, description, true);
    }
}
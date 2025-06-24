import { NextFunction, Request, Response } from "express";
import BaseError from "../errors/base.error";
import { status } from "http-status";
import isDevEnvironment from "../utils/is-development";

interface PostgresError extends Error {

    cause:{
        detail?: string;
        code?: string;
    };
}


class ErrorHandler {
    public async handleError(
        err: Error,
        req?: Request,
        res?: Response,
        _?: NextFunction
    ): Promise<void> {
       

        if (!req) return;
        let statusCode: number = status.INTERNAL_SERVER_ERROR;
        let message: string = status[500];
        if (err instanceof BaseError) {
            statusCode = err.httpCode;
            message = err.message;
        }
        // Handle Postgres unique constraint errors
        const pgErr = err as PostgresError;
        
            if (pgErr?.cause?.code === "23505") {
            statusCode = status.BAD_REQUEST;
            message = pgErr.cause.detail || "Duplicate entry";
        }

        res?.status(statusCode).json({
            message,
            ...(isDevEnvironment() && { stack: err?.stack }),
        });
    }

    public isTrustedError(error: Error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
export const errorHandler = new ErrorHandler();

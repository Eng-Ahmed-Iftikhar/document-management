import { Handler, NextFunction, Request, Response } from "express";

const asyncHandler =
    (fn: Handler) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);
export default asyncHandler;

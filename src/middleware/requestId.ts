import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            requestId: string;
        }
    }
}

export const requestId = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const value = req.header("x-request-id");
    const id = value && value.trim() ? value.trim() : randomUUID();

    req.requestId = id;
    res.setHeader("X-Request-Id", id);
    next();
};

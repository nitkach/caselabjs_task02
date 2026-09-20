import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

import { AppError } from "../errors/appError.js";

export const validateRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessage = result.error.issues
                .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
                .join("; ");

            next(new AppError(400, errorMessage));
            return;
        }

        req.body = result.data;
        next();
    };
};

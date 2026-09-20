import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

import { ValidationError } from "../errors/appError.js";

export const validateRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join(".") || "body",
                message: issue.message,
            }));

            next(new ValidationError("Некорректные данные запроса", details));
            return;
        }

        req.body = result.data;
        next();
    };
};

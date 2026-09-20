import type { ErrorRequestHandler } from "express";

import { AppError, type ErrorDetail } from "../errors/appError.js";

const defaultMessage = "Внутренняя ошибка сервера";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    const appError = err instanceof AppError ? err : undefined;
    const statusCode = appError?.statusCode ?? 500;
    const isProduction = process.env.NODE_ENV === "production";
    const isSafeAppError = appError !== undefined && statusCode < 500;
    const message = isSafeAppError
        ? appError.message
        : !isProduction && err instanceof Error
            ? err.message
            : defaultMessage;

    if (statusCode >= 500) {
        console.error(`[${req.requestId}]`, err);
    }

    const response: {
        error: {
            code: string;
            message: string;
            details: ErrorDetail[];
            requestId: string;
            stack?: string;
        };
    } = {
        error: {
            code: appError?.code ?? "INTERNAL_SERVER_ERROR",
            message,
            details: isProduction && statusCode >= 500 ? [] : appError?.details ?? [],
            requestId: req.requestId,
        },
    };

    if (!isProduction && err instanceof Error) {
        response.error.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

import type { NextFunction, Request, Response } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const startTime = process.hrtime.bigint();

    res.on("finish", () => {
        const timestamp = new Date().toISOString();
        const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

        console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${req.requestId} - code: ${res.statusCode} ${Math.round(durationMs * 100) / 100}ms`)
    });

    next();
};

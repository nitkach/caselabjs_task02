import type {
    NextFunction,
    RequestHandler,
    Request,
    Response,
} from "express";

export function asyncHandler<
    Params extends Record<string, string> = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = unknown,
    Locals extends Record<string, unknown> = Record<string, unknown>,
>(
    handler: (
        req: Request<Params, ResBody, ReqBody, ReqQuery, Locals>,
        res: Response<ResBody, Locals>,
        next: NextFunction,
    ) => void | Promise<void>,
): RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals> {
    return (req, res, next) => {
        Promise.resolve()
            .then(() => handler(req, res, next))
            .catch(next);
    };
}

import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import createHttpError from "http-errors";

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        const isAccess = roles.includes(authReq.auth.role?.toLocaleLowerCase());

        if (!isAccess) {
            const error = createHttpError(403, "You are not authorized to access this resource");
            return next(error);
        }

        next();
    };
};

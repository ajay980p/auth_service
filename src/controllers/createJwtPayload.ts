import { JwtPayload } from "../types";

export function createJwtPayload(user: any): JwtPayload {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
}
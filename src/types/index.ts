import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId: number;
}

export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: string
    };
}


export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface ITenant {
    name: string;
    address: string;
    mailId: string;
}


export interface CreateTenantRequest extends Request {
    body: ITenant
}

export interface refreshTokenPayload {
    userId: number,
    refreshToken: string
}


export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export interface updateUserData {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}


export interface JwtPayload {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}
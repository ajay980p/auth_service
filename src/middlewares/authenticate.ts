import { Request, Response, NextFunction } from "express";
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { Config } from "../config";
import { AuthCookie, AuthRequest } from "../types";
import fs from "fs";
import path from "path";

// Create a JWKS client
const client = jwksClient({
    jwksUri: Config.JWKS_URI!,
    cache: true,
    rateLimit: true,
});

// Function to get the signing key
// const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
//     console.log("JWT Header:", header);
//     client.getSigningKey(header.kid!, (err, key) => {
//         if (err) {
//             if (err.name === 'JwksError' && err.message === 'Not Found') {
//                 console.error("Key not found in JWKS endpoint:", err);
//             } else {
//                 console.error("Error getting signing key:", err);
//             }
//             callback(err);
//         } else if (key) {
//             const signingKey = key.getPublicKey();
//             console.log("Signing key found:", signingKey);
//             callback(null, signingKey);
//         } else {
//             console.error("Signing key not found");
//             callback(new Error("Signing key not found"));
//         }
//     });
// };

// Middleware function
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    let privateKey: Buffer;
    privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (req.cookies) {
        token = (req.cookies as AuthCookie).accessToken;
    }

    if (!token) {
        return res.status(401).send({ success: false, statusCode: 401, message: "No authorization token was found" });
    }

    jwt.verify(token, privateKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(401).send({ success: false, statusCode: 401, message: "Invalid token" });
        }

        // Attach the decoded token to the request object
        req.auth = decoded as any;
        next();
    });
};
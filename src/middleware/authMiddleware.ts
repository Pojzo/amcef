/**
 * @file Middleware for authentication and authorization of users 
 * @author Peter Kovac
 * @date 19.8.2024
 */

import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "./utils";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if authorization header is present 
        const authorizationHeader = req.headers.authorization;
        if (typeof authorizationHeader !== "string") {
            throw new Error("Authorization header is missing");
        }

        // Extract the JWT token from the authorization header
        const token = authorizationHeader.split(" ")[1];

        const { userId } = await getUserFromToken(token);

        req.body.userId = userId;
        next();
    }

    catch (error: unknown) {
        if (error instanceof Error) {
            res.status(401).json({ message: "Unauthorized", error });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
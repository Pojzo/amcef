/**
 * @file Middleware for authentication and authorization of users
 * @author Peter Kovac
 * @date 19.8.2024
 */

import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "./utils";
import { isLoggedInService } from "src/services/authServices";

/**
 * Checks for the presence of the authorization header and extracts the JWT token from it.
 * Sets the userId in the request body. Throws an error if the token is invalid.
 *
 * @param req Express Request
 * @param res Express response
 * @param next Next function to be called
 * @throws Error if the authorization header is missing or the token is invalid
 */
export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		// Check if authorization header is present
		const authorizationHeader = req.headers.authorization;
		if (typeof authorizationHeader !== "string") {
			throw new Error("Authorization header is missing");
		}

		// Extract the JWT token from the authorization header
		const token = authorizationHeader.split(" ")[1];

		const { userId } = await getUserFromToken(token);
		const isLoggedIn = await isLoggedInService(token);
		if (!isLoggedIn) {
			throw new Error("User is not logged");
		}

		req.body.userId = userId;
		req.body.token = token;
		next();
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(401).json({ message: "Unauthorized", error });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
};

/**
 * Similar to authMiddleware, but does not throw an error if the token is invalid.
 * In the presence of an invalid token, the userId in the request body is set to null.
 *
 * @param req Express Request
 * @param res   Express Response
 * @param next  Next function to be called
 */
export const optionalAuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	// Check if authorization header is present
	const authorizationHeader = req.headers.authorization;
	req.body.userId = null;

	if (typeof authorizationHeader !== "string") {
		return next();
	}
	// Extract the JWT token from the authorization header
	const token = authorizationHeader.split(" ")[1];

	// In the presence of an invalid token, the userId in the request body is set to null.
	// Otherwise the userId is set to the userId from the token.
	try {
		const { userId } = await getUserFromToken(token);
		req.body.userId = userId;
		next();
	} catch (error: any) {
		next();
	}
};

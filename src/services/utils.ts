/**
 * @file Utility functions for services.
 * @author Peter Kovac
 * @date 19.8.2024
 */

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "src/configs/jwtConfig";
import { getUserFromToken } from "src/middleware/utils";
import { userExistsEmailService, userExistsIdService } from "./authServices";

/**
 * Sign a JWT token with the given payload.
 *
 * @param payload Payload consisting of userId.
 * @returns Promise that resolves to a JWT token.
 * @throws Error if there is an error when signing the JWT token.
 */
export const signToken = (payload: JWTData) => {
	try {
		return jwt.sign(payload, JWT_SECRET);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in signToken");
		}
	}
};

/**
 *
 * @param token Token to verify
 * @returns Promise that resolves to true if the token is valid, false otherwise.
 */
export const verifyToken = async (token: string): Promise<boolean> => {
	try {
		const userId = jwt.verify(token, JWT_SECRET) as string;

		return await userExistsIdService(userId);
	} catch (error: unknown) {
		console.error(error);
		return false;
	}
};

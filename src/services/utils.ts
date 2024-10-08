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
 * @returns Promise that resolves to a JWT token if successful, null otherwise.
 */
export const signToken = (payload: JWTData): string | null => {
	try {
		return jwt.sign(payload, JWT_SECRET);
	} catch (error: unknown) {
		return null;
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

import bcrypt from "bcrypt";

/**
 * Hash the given password using bcrypt.
 *
 * @param password The password to hash.
 * @returns A promise that resolves to the hashed password.
 * @throws Error if hashing fails.
 */
export const hashPassword = async (password: string): Promise<string> => {
	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		return hashedPassword;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Failed to hash password: ${error.message}`);
		} else {
			throw new Error(
				"An unknown error occurred while hashing the password"
			);
		}
	}
};

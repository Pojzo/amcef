/**
 * @file Contains services for authentication
 * @author Peter Kovac
 * @date 19.8.2024
 *
 */

import { getUserFromToken } from "src/middleware/utils";
import { signToken } from "./utils";
import { models } from "src/db";
import { users } from "models/users";

/**
 * Checks if a user with the given email exists.
 *
 * @param email The email addess of the user to check.
 * @returns True if the user exists, false otherwise.
 * @throws Error if there is an error when interacting with the database.
 */
export const userExistsEmailService = async (
	email: string
): Promise<boolean> => {
	try {
		const userExists = await models.users.findOne({ where: { email } });

		return userExists !== null;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in userExistsService");
		}
	}
};

/**
 *
 * @param userId Id of the user to check.
 * @returns Promise that resolves to true if the user exists, false otherwise.
 * @throws Error if there is an error when interacting with the database.
 */
export const userExistsIdService = async (
	userId: number | string
): Promise<boolean> => {
	try {
		const userExists = await models.users.findOne({ where: { userId } });

		return userExists !== null;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in userExistsService");
		}
	}
};

/**
 * Create a new user with the given email and password.
 *
 * @param email Email of the user to create.
 * @param password Password of the user to create.
 * @returns Promise that resolves when the user is successfully created.
 * @throws Error if there is an error when interacting with the database.
 */
export const createUserService = async (
	email: string,
	password: string
): Promise<users> => {
	try {
		const user = models.users.create({ email, password });
		if (!user) {
			throw new Error("User could not be created");
		}

		return user;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in createUserService");
		}
	}
};

/**
 * Logs in the user by checking the email and password and signing a JWT token.
 *
 * @param email Email of the user to login.
 * @param password  Password of the user to login.
 * @returns JWT token if the login is successful.
 * @throws Error if there is an error when interacting with the database or signing of the JWT token.
 */
export const loginUserService = async (
	email: string,
	password: string
): Promise<string> => {
	try {
		const user = await models.users.findOne({
			where: { email, password },
			raw: true,
		});

		if (!user) {
			throw new Error("User not found");
		}
		const userId = user.userId;
		const jwtTokenVersion = user.jwtTokenVersion;

		const token = signToken({ userId, jwtTokenVersion });

		return token;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in loginUserService");
		}
	}
};

/**
 * Logs out the user by incrementing the JWT token version.
 *
 * @param userId Id of the user to logout.
 * @throws Error if there is an error when interacting with the database.
 */
export const logoutUserService = async (userId: string): Promise<void> => {
	try {
		const user = await models.users.findOne({ where: { userId } });
		const previousTokenVersion = user.get({ plain: true }).jwtTokenVersion;
		const nextVersion = previousTokenVersion + 1;
		user.set({
			jwtTokenVersion: nextVersion,
		});
		await user.save();
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in logoutUserService");
		}
	}
};

export const isLoggedInService = async (token: string): Promise<boolean> => {
	try {
		const { userId, jwtTokenVersion } = await getUserFromToken(token);
		// tokenVersion is the version of the token in the database
		const rawData = await models.users.findOne({
			where: { userId },
			attributes: ["jwtTokenVersion"],
		});

		const data = rawData.get({ plain: true });

		const dbTokenVersion = data.jwtTokenVersion;

		if (jwtTokenVersion !== dbTokenVersion) {
			return false;
		}
		return true;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in isLoggedInService");
		}
	}
};

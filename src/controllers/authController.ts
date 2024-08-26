/**
 * @file Controller for authentication routes
 * @author Peter Kovac
 * @date 19.8.2024
 */

import { Request, Response } from "express";
import {
	createUserService,
	isLoggedInService,
	loginUserService,
	logoutUserService,
	userExistsEmailService,
	userExistsIdService,
} from "src/services/authServices";
import { handleControllerError } from "./controllerError";

/**
 * Handles user registration for the /auth/register route.
 *
 * @param req Express request object. The `req.body` should contain the `email` and `password` for the new user.
 * @param res Express response object. Status codes:
 *  - 201 if the registration is successful and a user is created. Returns a JSON object with the `token`.
 *  - 409 if the user already exists (conflict error).
 *  - 500 if an internal server error occurs.
 * @returns void
 */
export const handleRegister = async (req: Request, res: Response) => {
	try {
		const userExists = await userExistsEmailService(req.body.email);
		if (userExists) {
			return res.status(409).json({ message: "User already exists" });
		}

		const user = await createUserService(req.body.email, req.body.password);
		const token = await loginUserService(req.body.email, req.body.password);

		res.status(201).json({ token });
	} catch (error: unknown) {
		console.error(error);
		handleControllerError(error, res);
	}
};

/**
 * Handles user login for the /auth/login route.
 *
 * @param req Express request object. The `req.body` should contain the `email` and `password` for the user trying to log in.
 * @param res Express response object. Status codes:
 *  - 200 if login is successful and a valid `token` is returned. The token should is included in the response body.
 *  - 404 if the email or password is incorrect, indicating that the user was not found.
 *  - 500 if there is an internal server error or if the token could not be validated.
 */
export const handleLogin = async (req: Request, res: Response) => {
	try {
		const user = await userExistsEmailService(req.body.email);
		if (!user) {
			return res
				.status(404)
				.json({ message: "Invalid email or password" });
		}

		const token = await loginUserService(req.body.email, req.body.password);

		if (!token) {
			return res
				.status(500)
				.json({ message: "Token could not be validated" });
		}

		res.status(200).json({ token });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Handles the /auth/logout route to log out a user.
 *
 * @param req Express request object. The `req.body` should include:
 *  - `userId`: The ID of the user to log out.
 *  - `token`: The authentication token of the user.
 * @param res Express response object. Status codes:
 *  - 200 if the user was logged out successfully. The response will include a success message.
 *  - 404 if the user was not found.
 *  - 401 if the user is not currently logged in.
 * @returns void
 */
export const handleLogout = async (req: Request, res: Response) => {
	try {
		if (!(await userExistsIdService(req.body.userId))) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!(await isLoggedInService(req.body.token))) {
			return res.status(401).json({ message: "User is not logged in" });
		}

		await logoutUserService(req.body.userId);
		res.status(200).json({ message: "User logged out" });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Handles the /auth/is-logged-in route to check if the user is logged in based on the provided token.
 *
 * @param req Express request object. The `req.headers` should include an `Authorization` header containing the token.
 * @param res Express response object. Status codes:
 *  - 200 if the request is processed successfully. The response will include:
 *    - `isLoggedIn`: A boolean indicating whether the token is valid and the user is logged in.
 *    - `message`: A message indicating the status of the `Authorization` header if it was invalid or missing.
 * @returns void
 */
export const handleIsLoggedIn = async (req: Request, res: Response) => {
	try {
		const authorizationHeader = req.headers.authorization;

		if (typeof authorizationHeader !== "string") {
			return res.status(200).json({
				isLoggedIn: false,
				message: "Authorization header is missing",
			});
		}
		const split = authorizationHeader.split(" ");
		if (split.length !== 2) {
			return res.status(200).json({
				isLoggedIn: false,
				message: "Authorization header is invalid",
			});
		}
		const token = authorizationHeader.split(" ")[1];

		const isLoggedIn = await isLoggedInService(token);

		res.status(200).json({ isLoggedIn });
	} catch (error: unknown) {
		res.status(200).json({ isLoggedIn: false });
		// handleControllerError(error, res);
	}
};

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
import { signToken } from "src/services/utils";
import { handleControllerError } from "./controllerError";
import { getUserFromToken } from "src/middleware/utils";

/**
 * Controller for the /auth/register route.
 *
 * @param req Request object
 * @param res Response object
 */
export const handleRegister = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const userExists = await userExistsEmailService(req.body.email);
		if (userExists) {
			return res.status(409).json({ message: "User already exists" });
		}

		// If any of these functions fail, an error will be thrown inside the service functions
		// and the catch block will handle it
		const user = await createUserService(req.body.email, req.body.password);
		const token = await loginUserService(req.body.email, req.body.password);

		res.status(201).json({ token, user });
	} catch (error: unknown) {
		console.error(error);
		handleControllerError(error, res);
	}
};

/**
 * Controller for the /auth/login route.
 *
 * @param req Request
 * @param res Response
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
 * Controller for the /auth/logout route.
 *
 * @param req Request
 * @param res Response
 * @returns
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
		console.log("successfully logged out");
		res.status(200).json({ message: "User logged out" });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Controller for the /auth/is-logged-in route.
 *
 * @param req Request
 * @param res Response
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
		console.log("is actually logged in", isLoggedIn);

		res.status(200).json({ isLoggedIn });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

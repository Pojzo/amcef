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
		if (error instanceof Error) {
			console.error(error.message);
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
};

/**
 * Controller for the /auth/login route.
 *
 * @param req Request
 * @param res Response
 */
export const handleLogin = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const token = await loginUserService(req.body.email, req.body.password);

		res.status(200).json({ token });
	} catch (error: unknown) {
		if (error instanceof Error) {
			if (error.message === "User not found") {
				res.status(404).json({ message: "User not found" });
			} else {
				res.status(500).json({
					message: "Internal Server Error",
					error,
				});
			}
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
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
		if (await isLoggedInService(req.body.token)) {
			return res.status(401).json({ message: "User is not logged in" });
		}

		await logoutUserService(req.body.userId);
		res.status(200).json({ message: "User logged out" });
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({
				message: "Internal Server Error: " + error.message,
			});
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
};

/**
 * Controller for the /auth/is-logged-in route.
 *
 * @param req Request
 * @param res Response
 */
export const handleIsLoggedIn = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const authorizationHeader = req.headers.authorization;
		if (typeof authorizationHeader !== "string") {
			res.status(401).json({
				isLoggedIn: false,
				message: "Authorization header is missing",
			});
		}
		const token = authorizationHeader.split(" ")[1];

		const isLoggedIn = await isLoggedInService(token);

		res.status(200).json({ isLoggedIn });
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({
				message: "Internal Server Error: " + error.message,
			});
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
};

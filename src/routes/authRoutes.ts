/**
 * @file Contains routes for authentication and authorization of users.
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import {
	handleIsLoggedIn,
	handleLogin,
	handleLogout,
	handleRegister,
} from "src/controllers/authController";
import { models } from "src/db";
import { authMiddleware } from "src/middleware/authMiddleware";
import { validateLogin, validateRegister } from "src/middleware/userValidator";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, handleRegister);
authRouter.post("/login", validateLogin, handleLogin);
authRouter.post("/logout", authMiddleware, handleLogout);

// just for testing
authRouter.post("/delete", async (req, res) => {
	const email = req.body.email;
	if (!email) {
		return res.status(200).json({ message: "No email provided" });
	}
	try {
		await models.users.destroy({ where: { email } });
		res.status(200).json({ message: "User deleted" });
	} catch (error: unknown) {
		console.error("toto je error", error);
		res.status(200).json({ message: "Error deleting user" });
	}
});

authRouter.get("/is-logged-in", handleIsLoggedIn);

export default authRouter;

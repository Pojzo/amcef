/**
 * @file Contains routes for authentication and authorization of users.
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import { handleIsLoggedIn, handleLogin, handleLogout, handleRegister } from "src/controllers/authController";
import { authMiddleware } from "src/middleware/authMiddleware";
import { validateLogin, validateRegister } from "src/middleware/validator";

const authRouter = express.Router();

authRouter.post("/register", validateRegister, handleRegister);
authRouter.post("/login", validateLogin, handleLogin);
authRouter.post("/logout", authMiddleware, handleLogout);

authRouter.get('/is-logged-in', authMiddleware, handleIsLoggedIn);

export default authRouter;
/**
 * @file routes
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import { handleIsLoggedIn, handleLogin, handleLogout, handleRegister } from "src/controllers/authController";
import { authMiddleware } from "src/middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", handleRegister);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", authMiddleware, handleLogout);

authRouter.get('/is-logged-in', authMiddleware, handleIsLoggedIn);

export default authRouter;
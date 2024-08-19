/**
 * @file routes
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import { handleLogin, handleRegister } from "src/controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", handleRegister);

authRouter.post("/login", handleLogin);


authRouter.post("/logout", (req, res) => {
    res.send("Logout route");
});

export default authRouter;
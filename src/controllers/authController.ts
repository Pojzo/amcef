/**
 * @file Controller for authentication routes
 * @author Peter Kovac
 * @date 19.8.2024
 */


import { Request, Response } from 'express';
import { createUserService, loginUserService, userExistsService } from 'src/services/authServices';

export const handleRegister = async (req: Request, res: Response) => {
    try {
        const userExists = await userExistsService(req.body.email);
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // If any of these functions fail, an error will be thrown inside the service functions
        // and the catch block will handle it
        const user = await createUserService(req.body.email, req.body.password);
        const token = await loginUserService(req.body.email, req.body.password);

        return res.status(201).json({ token, user });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const userExists = await userExistsService(req.body.email);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = await loginUserService(req.body.email, req.body.password);

        return res.status(200).json({ token });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleLogout = async (req: Request, res: Response) => {
    try {

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
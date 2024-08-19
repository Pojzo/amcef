/**
 * @file Main router of the server application
 * @author Peter Kovac
 * @date 19.8.2024
 */

import authRouter from "./authRoutes";
import taskRouter from "./taskRoutes";
import userRouter from "./userRoutes";

// Define routes and forward them to the appropriate router
const Router = (server) => {
    server.use("/auth", authRouter);
    server.use("/api/user", userRouter);
    server.use("/api/task", taskRouter);

    // test route
    server.get("/", (req, res) => {
        res.send("Hello World!");
    });
}

export default Router;
/**
 * @file Entry point of the server application
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import Router from "./routes";
import { PORT, URL } from "./configs/server_config";

const server = express();

// Middleware
server.use(cors());
server.disable("x-powered-by");
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

Router(server);

// Listen for incoming requests
server.listen(PORT, () => {
    console.log(`Server running on URL: ${URL}`);
});
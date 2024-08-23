/**
 * @file Error handling for controller functions
 * @author Peter Kovac
 * @date 23.8.2024
 */

import { CustomError } from "src/services/listServices";
import { Response } from "express";
/**
 * Generic error handler for controllers. If the error is an instance of CustomError,
 * a message along with an extended message is sent to the client. Otherwise, a generic
 * "Internal Server Error" message is sent.
 *
 * @param error Error or CustomError object
 * @param res
 */
export const handleControllerError = (error: unknown, res: Response) => {
	if (error instanceof CustomError) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error: " + error.message,
			extendedMessage: error?.extendedMessage,
		});
	} else if (error instanceof Error) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error: " + error.message,
		});
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

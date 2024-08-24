/**
 * @file Validation functions for list routes
 * @author Peter Kovac
 * @date 24.8.2024
 */

import { Request, Response, NextFunction } from "express";

import { body, check, validationResult } from "express-validator";

const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: errors.array()[0].msg,
		});
	}
	next();
};

export const validateListId = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateUpdateItem = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	check("itemId")
		.isInt({ gt: 0 })
		.withMessage("itemId must be a positive integer"),
	body("title").isString().withMessage("title must be a string"),
	body("description").isString().withMessage("description must be a string"),
	body("deadline").isISO8601().withMessage("deadline must be a valid date"),
	body("flag")
		.isIn(["active", "finished", "aborted"])
		.withMessage("flag must be one of 'active', 'finished', 'aborted'"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateCreateItem = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	body("title")
		.isString()
		.withMessage("title must be a string")
		.notEmpty()
		.withMessage("title must not be empty"),
	body("description")
		.isString()
		.withMessage("description must be a string")
		.notEmpty()
		.withMessage("description must not be empty"),
	body("deadline").isISO8601().withMessage("deadline must be a valid date"),
	body("flag")
		.isIn(["active", "finished", "aborted"])
		.withMessage("flag must be one of 'active', 'finished', 'aborted'"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateCreateList = [
	check("title")
		.isString()
		.withMessage("title must be a string")
		.isLength({ min: 1 })
		.withMessage("title must not be empty"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateDeleteList = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateDeleteItem = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	check("itemId")
		.isInt({ gt: 0 })
		.withMessage("itemId must be a positive integer"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateAddUserToList = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	body("email").isEmail().withMessage("Invalid email address"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

export const validateRemoveUserFromList = [
	check("listId")
		.isInt({ gt: 0 })
		.withMessage("listId must be a positive integer"),
	check("email").isEmail().withMessage("Invalid email address"),
	(req: Request, res: Response, next: NextFunction) => {
		handleValidationErrors(req, res, next);
	},
];

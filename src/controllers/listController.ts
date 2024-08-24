/**
 * @file Contains controllers for list management.
 * @author Peter Kovac
 * @date 20.8.2024
 */

import { Request, Response } from "express";
import {
	userExistsEmailService,
	userExistsIdService,
} from "src/services/authServices";
import {
	addItemToListService,
	addUserToListService,
	createListService,
	deleteItemFromListService,
	deleteListService,
	getAllListUsersService,
	getItemService,
	getListService,
	getListsService,
	getUserByEmailService,
	isUserCreatorService,
	listBelongsToUserService,
	removeUserFromListService,
	updateItemInListService,
	updateListService,
} from "src/services/listServices";
import { handleControllerError } from "./controllerError";

/**
 * Retrieves all lists from the database.
 *
 * @param req Express request
 * @param res Express response
 */
export const handleGetAllLists = async (req: Request, res: Response) => {
	try {
		const userId = req.body.userId;
		const lists = await getListsService(userId ? parseInt(userId) : null);

		const listIds = lists.map((list) => list.listId);

		const users = await getAllListUsersService(listIds);

		lists.forEach((list) => {
			list.users = users[list.listId];
		});

		res.status(200).json({ lists });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

export const handleCreateList = async (req: Request, res: Response) => {
	try {
		const listId = await createListService(req.body.userId, req.body.title);

		const responseList = await getListService(listId);

		return res.status(201).json({ list: responseList });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

// export const handleGetMyLists = async (req: Request, res: Response) => {
// 	try {
// 		const myLists = await getMyListsService(req.body.userId);

// 		return res.status(200).json({ myLists });
// 	} catch (error: unknown) {
// 		handleError(error, res);
// 	}
// };

export const handleGetList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);

		const list = await getListsService(null, listId);

		res.status(200).json({ list });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 *
 * @param req Express request, the body should contain the new title of the list.
 *			  The listId should be in the URL.
 * @param res
 * @returns 204 if the list was updated successfully, 404 if the list was not found.
 */
export const handleUpdateList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const listExists = await getListService(listId);
		if (!listExists) {
			return res.status(404).json({ message: "List not found" });
		}
		await updateListService(listId, req.body.title);
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Deletes a list. The user must be the creator of the list.
 *
 * @param req Express request, the listId should be in the URL.
 * @param res Express response.
 * @returns Status code 204 if the list was deleted successfully, 404 if the list was not found.
 * 			and 403 if the user is not the creator of the list, 500 if an internal server error occurred.
 */
export const handleDeleteList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);

		// Check if the list exists
		const list = await getListService(listId);
		if (!list) {
			return res.status(404).json({ message: "List not found" });
		}

		// Check if the user is the creator of the list
		const isUserCreator = await isUserCreatorService(
			req.body.userId,
			listId
		);
		if (!isUserCreator) {
			return res
				.status(403)
				.json({ message: "Only the owner of a list can delete it" });
		}
		// Delete the list
		await deleteListService(listId);
		res.status(204).end();
	} catch (err: unknown) {
		handleControllerError(err, res);
	}
};

/**
 * Given a listId and Item object in the request body, adds the item to the list.
 *
 * @param req Express request, body contains the ID of the user who is adding the item to the list.
 *			  The listId should be in the URL.
 * @param res
 * @returns Status code 200 if the item was added successfully, 404 if the user or list was not found.
 * 				500 if an internal server error occurred.
 */
export const handleAddItemToList = async (req: Request, res: Response) => {
	const listId = parseInt(req.params.listId);
	console.log("adding;", req.body, listId);
	try {
		if (!(await userExistsIdService(req.body.userId))) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!(await getListService(listId))) {
			return res.status(404).json({ message: "List not found" });
		}
		req.body.listId = listId;
		console.log(req.body);
		const newItem = await addItemToListService(req.body);

		console.log(newItem);
		res.status(201).json({ message: "OK", item: newItem });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

export const handleGetItemsInList = async (req: Request, res: Response) => {};

/**
 * Updates an item in a list.
 *
 * The `listId` should be provided as a URL parameter, while the `itemId` should be included in the request body.
 *
 * @param req - The Express request object. The `req.params` should contain the `listId`,
 *              and `req.body` should contain the `itemId` and the updated item details.
 * @param res - The Express response object.
 * @returns Status code 200 with a success message if the item was updated successfully.
 *          Status code 404 with an error message if either the list or the item was not found.
 *          Status code 500 if an internal server error occurred.
 */
export const handleUpdateItemInList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		req.body.itemId = parseInt(req.params.itemId);

		const list = await getListService(listId);
		if (!list) {
			return res.status(404).json({ message: "List not found" });
		}

		const updateItem = await updateItemInListService(req.body);

		if (!updateItem) {
			return res.status(404).json({ message: "Item not found" });
		}

		return res.status(200).json({ message: "OK" });
	} catch (err: unknown) {
		handleControllerError(err, res);
	}
};

export const handleDeleteItemFromList = async (req: Request, res: Response) => {
	const { listId, itemId } = req.params;
	try {
		const list = await getListService(parseInt(listId));
		if (!list) {
			return res.status(404).json({ message: "List not found" });
		}
		const userBelongsToList = await listBelongsToUserService(
			req.body.userId,
			parseInt(listId)
		);
		if (!userBelongsToList) {
			return res.status(403).json({
				message: "Only the owner of a list can delete its items",
			});
		}
		const item = await getItemService(parseInt(itemId));
		if (!item) {
			return res.status(404).json({ message: "Item not found" });
		}

		await deleteItemFromListService(parseInt(itemId));
		res.status(204).end();
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

export const handleAddUserToList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const email = req.body.email;

		if (!(await userExistsEmailService(email))) {
			return res.status(404).json({ message: "User not found" });
		}
		const { userId: targetId } = await getUserByEmailService(email);
		if (await listBelongsToUserService(targetId, listId)) {
			return res.status(409).json({
				message: "User is already in the list",
			});
		}

		const list = await getListService(listId);
		if (!list) {
			return res.status(404).json({ message: "List not found" });
		}
		if (!list.createdBy === req.body.userId) {
			return res
				.status(403)
				.json({ message: "Only the owner of a list can add users" });
		}
		const { userId } = await getUserByEmailService(email);

		await addUserToListService(listId, userId);
		res.status(201).end();
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

export const handleRemoveUserFromList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const email = req.params.email;
		if (!(await userExistsEmailService(email))) {
			return res.status(404).json({ message: "User not found" });
		}
		const users = await getAllListUsersService([listId]);
		if (!users[listId].includes(email)) {
			return res.status(404).json({ message: "User not in list" });
		}
		await removeUserFromListService(listId, email);

		res.status(204).end();
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

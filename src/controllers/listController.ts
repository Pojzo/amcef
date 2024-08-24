/**
 * @file Contains controllers for list management.
 * @author Peter Kovac
 * @date 20.8.2024
 */

// Express imports
import { Request, Response } from "express";

// Auth services imports
import { userExistsEmailService } from "src/services/authServices";

// List services imports
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
 * @param req Express request object. The `req.body` may contain:
 *            - `userId`: (optional) ID of the user to filter the lists
 * @param res Express response object. Status code:
 *  - 200 with the list of all lists and their associated users if retrieval was successful
 *  - 500 if an internal server error occurred
 * @returns void
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

/**
 * Handles creating a new list.
 *
 * @param req Express request object. The `req.body` should contain:
 *            - `userId`: ID of the user creating the list
 *            - `title`: Title of the new list
 * @param res Express response object. Status codes:
 *  - 201 with the created list object if the list was created successfully
 *  - 400 if there is a validation error or missing parameters (not shown but recommended for handling invalid requests)
 * @returns void
 */
export const handleCreateList = async (req: Request, res: Response) => {
	try {
		const listId = await createListService(req.body.userId, req.body.title);

		const responseList = await getListService(listId);

		return res.status(201).json({ list: responseList });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Handles retrieving a list by its ID.
 *
 * @param req Express request object. The `req.params` should contain the `listId` of the list to retrieve.
 * @param res Express response object. Status codes:
 *  - 200 with the list object if the list was found
 *  - 404 if the list was not found
 * @returns void
 */
export const handleGetList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);

		const list = await getListsService(null, listId);
		if (!list) {
			return res.status(404).json({ message: "List not found" });
		}

		res.status(200).json({ list });
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Handles updating the title of a list.
 *
 * @param req Express request object. The `req.params` should contain the `listId`, and `req.body` should contain the new `title` of the list.
 * @param res Express response object. Status codes:
 *  - 204 if the list was updated successfully
 *  - 404 if the list was not found
 * @returns void
 */
export const handleUpdateList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const listExists = await getListService(listId);
		if (!listExists) {
			return res.status(404).json({ message: "List not found" });
		}
		await updateListService(listId, req.body.title);
		res.status(204).end();
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

/**
 * Handles deleting a list. The user must be the creator of the list.
 *
 * @param req Express request object. The `req.params` should contain the `listId`, and `req.body` should contain the `userId`.
 * @param res Express response object. Status codes:
 *  - 204 if the list was deleted successfully
 *  - 404 if the list was not found
 *  - 403 if the user is not the creator of the list
 *  - 500 if an internal server error occurred
 * @returns void
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
 * Handles adding an item to a list.
 *
 * @param req Express request object. The `req.params` should contain the `listId`,
 *            and `req.body` should contain the `userId` of the user adding the item and the item details.
 * @param res Express response object. Status codes:
 *  - 201 if the item was added successfully, with the newly created item in the response body
 *  - 404 if the list was not found
 *  - 403 if the user is not associated with the list
 *  - 500 if an internal server error occurred
 * @returns void
 */
export const handleAddItemToList = async (req: Request, res: Response) => {
	const listId = parseInt(req.params.listId);
	console.log("adding;", req.body, listId);
	try {
		// Check if the list exists
		if (!(await getListService(listId))) {
			return res.status(404).json({ message: "List not found" });
		}

		// Check if the user is associated with the list
		if (!(await listBelongsToUserService(req.body.userId, listId))) {
			return res.status(403).json({
				message: "Only a user associated with a list can add items",
			});
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
 * Handles updating an item in a list.
 *
 * @param req Express request object. The `req.params` should contain the `listId`,
 *            and `req.body` should contain the `itemId` and the updated item details.
 * @param res Express response object. Status codes:
 *  - 200 if the item was updated successfully
 *  - 404 if either the list or the item was not found
 * 	- 403 if the user is not associated with the list
 *  - 500 if an internal server error occurred
 * @returns void
 */
export const handleUpdateItemInList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		req.body.itemId = parseInt(req.params.itemId);

		const list = await getListService(listId);
		if (!list) {
			return res.status(404).json({ message: "List not found" });
		}

		const userBelongsToList = await listBelongsToUserService(
			req.body.userId,
			listId
		);
		if (!userBelongsToList) {
			return res.status(403).json({
				message: "Only the owner of a list can update its items",
			});
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

/**
 * Handles deleting an item from a list.
 *
 * @param req Express request object. `listId` and `itemId` should be in the URL.
 * @param res Express response object. Status codes:
 * 			  - 204 if the item was deleted successfully,
 * 			  - 404 if the list or item was not found,
 * 			  - 403 if the user is not the creator of the list,
 * @returns void
 */
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

/**
 * Adds a user to a list. The user must be the owner of the list to perform this action.
 *
 * @param req Express request object. The `req.params` should contain:
 *            - `listId`: ID of the list to which the user will be added.
 *            The `req.body` should contain:
 *            - `email`: Email of the user to be added to the list.
 *            - `userId`: ID of the user making the request.
 * @param res Express response object. Status codes:
 *  - 201 if the user was added successfully.
 *  - 404 if the user or list was not found.
 *  - 403 if the request user is not the owner of the list.
 *  - 409 if the user is already in the list.
 *  - 500 if an internal server error occurred.
 * @returns void
 */
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
		if (list.createdBy !== req.body.userId) {
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

/**
 * Removes a user from a list.
 *
 * @param req Express request object. The `listId` should be in the URL parameters, and the `email` of the user to be removed should also be in the URL parameters.
 * @param res Express response object. Status codes:
 *  - 204 if the user was successfully removed from the list,
 *  - 404 if the user was not found or is not in the list,
 *  - 500 if an internal server error occurred.
 * @returns void
 */
export const handleRemoveUserFromList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const email = req.params.email;

		if (!(await userExistsEmailService(email))) {
			return res.status(404).json({ message: "User not found" });
		}

		const users = await getAllListUsersService([listId]);
		if (!users[listId]?.includes(email)) {
			return res.status(404).json({ message: "User not in list" });
		}

		await removeUserFromListService(listId, email);

		res.status(204).end();
	} catch (error: unknown) {
		handleControllerError(error, res);
	}
};

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
	getAllListsService,
	getAllListUsersService,
	getListService,
	getMyListsService,
	getUserByEmailService,
	isUserCreatorService,
	listBelongsToUserService,
	removeUserFromListService,
	updateItemInListService,
	updateListService,
} from "src/services/listServices";

const handleError = (error: unknown, res: Response) => {
	if (error instanceof Error) {
		console.error(error);
		res.status(500).json({
			message: "Internal Server Error: " + error.message,
		});
	} else {
		res.status(500).json({ message: "Internal Server Error" });
	}
};

export const handleGetAllLists = async (req: Request, res: Response) => {
	try {
		const userId = req.body.userId;
		const lists = await getAllListsService(userId);

		const listIds = lists.map((list) => list.listId);

		const users = await getAllListUsersService(listIds);

		lists.forEach((list) => {
			list.users = users[list.listId];
		});

		console.log(lists);
		res.status(200).json({ lists });
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleCreateList = async (req: Request, res: Response) => {
	console.log("creating list");
	try {
		const list = await createListService(req.body.userId, req.body.title);

		return res.status(201).json({ list });
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleGetMyLists = async (req: Request, res: Response) => {
	try {
		const myLists = await getMyListsService(req.body.userId);

		return res.status(200).json({ myLists });
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleGetList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const listBelongsToUser = await listBelongsToUserService(
			req.body.userId,
			listId
		);
		if (!listBelongsToUser) {
			return res
				.status(403)
				.json({ message: "List does not belong to user" });
		}
		const list = await getListService(listId);

		res.status(200).json({ list });
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleUpdateList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const listExists = await getListService(listId);
		if (!listExists) {
			return res.status(404).json({ message: "List not found" });
		}
		await updateListService(listId, req.body.title);
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleDeleteList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const isUserCreator = await isUserCreatorService(
			req.body.userId,
			listId
		);
		if (!isUserCreator) {
			return res
				.status(403)
				.json({ message: "Only the owner of a list can delete it" });
		}
		await deleteListService(req.body.userId, listId);
		res.status(204).end();
	} catch (err: unknown) {
		handleError(err, res);
	}
};

export const handleAddItemToList = async (req: Request, res: Response) => {
	const listId = parseInt(req.params.listId);
	try {
		if (!(await userExistsIdService(req.body.userId))) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!(await getListService(listId))) {
			return res.status(404).json({ message: "List not found" });
		}
		console.log(req.body);
		req.body.listId = listId;
		await addItemToListService(req.body);

		res.status(200).json({ message: "OK" });
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleGetItemsInList = async (req: Request, res: Response) => {};

export const handleUpdateItemInList = async (req: Request, res: Response) => {
	try {
		console.log("updating");
		req.body.itemId = parseInt(req.params.itemId);
		const updateItem = await updateItemInListService(req.body);
		console.log(req.body);
		if (!updateItem) {
			return res.status(404).json({ message: "Item not found" });
		}
		res.status(200).json({ message: "OK" });
	} catch (err: unknown) {
		handleError(err, res);
	}
};

export const handleDeleteItemFromList = async (req: Request, res: Response) => {
	const { listId, itemId } = req.params;
	try {
		if (!(await getListService(parseInt(listId)))) {
			return res.status(404).json({ message: "List not found" });
		}
		await deleteItemFromListService(parseInt(itemId));
		res.status(204).end();
	} catch (error: unknown) {
		handleError(error, res);
	}
};

export const handleAddUserToList = async (req: Request, res: Response) => {
	try {
		const listId = parseInt(req.params.listId);
		const email = req.body.email;

		if (!(await userExistsEmailService(email))) {
			return res.status(404).json({ message: "User not found" });
		}
		console.error("Adding user to list", listId, email);

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
		res.status(204).end();
	} catch (error: unknown) {
		handleError(error, res);
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
		console.log("got after this");

		res.status(204).end();
	} catch (error: unknown) {
		handleError(error, res);
	}
};

/**
 * @file Contains services for list management.
 * @author Peter Kovac
 * @date 22.8.2024
 */

import { models } from "src/db";
import { CreateItem } from "src/types";
import {
	ItemProps,
	ItemPropsBase,
	ItemPropsRaw,
	ListProps,
	ListPropsRaw,
} from "./types";
import { itemsAttributes } from "models/items";
import { usersAttributes } from "models/users";
import { Op } from "sequelize";

/**
 * Custom error class that extends the Error class. Adds an extendedMessage field
 */
export class CustomError extends Error {
	extendedMessage?: string;

	constructor(message: string, extendedMessage?: string) {
		super(message);
		this.extendedMessage = extendedMessage;
		this.name = "CustomError";
	}
}

/**
 * Generic error handler for services. Throws a CustomError with a message.
 * Uses CustomError to provide more information about the error, like the function
 * in which the error occurred.
 *
 * @param error Error object
 * @param functionOrigin String representing the function where the error occurred
 */
const handleServiceError = (error: unknown, functionOrigin: string): void => {
	const extendedMessage = `An error occurred in ${functionOrigin}`;
	if (error instanceof Error) {
		throw new CustomError(error.message, error.message + extendedMessage);
	} else {
		throw new CustomError("An error occurred in " + functionOrigin);
	}
};

const _transformItem = (item: ItemPropsRaw, userId?: number): ItemProps => {
	const { createdBy_user, createdBy, listId, ...rest } = item;
	return {
		...rest,
		isCreator: userId === createdBy,
		creatorEmail: userId ? createdBy_user.email : null,
	};
};

/**
 * Transforms the raw list from the database to a ListProps object. Essentialy removes unnecessary
 * fields and adds a few new ones, such as isCreator and creatorEmail deduced from the userId.
 *
 * @param list Raw lists from the database
 * @param userId ID of the user, will be used to determine if the user is the creator of the listq
 * @returns ListProps object
 */
const _transformList = (list: ListPropsRaw, userId?: number): ListProps => {
	const { createdBy_user, createdBy, items, ...rest } = list;
	return {
		...rest,
		items: items.map((item) => _transformItem(item, userId)),
		isCreator: userId === createdBy,
		creatorEmail: userId ? createdBy_user.email : null,
	};
};

/**
 * Groups listIds and user emails into a dictionary. The resulting is a dictionary where the keys are
 * listIds and the values are arrays of user emails.
 *
 * @param userLists List of userLists
 * @param userId ID of the user
 * @returns Grouped dictionary
 */
const _groupEmailByListId = (userLists: any[]): Record<string, string[]> => {
	const grouped = {};
	userLists.forEach((userList) => {
		const { listId, user } = userList;
		if (!grouped[listId]) {
			grouped[listId] = [];
		}
		grouped[listId].push(user.email);
	});
	return grouped;
};

/**
 * Gets all lists from the database. If userId is provided, the function will return only lists
 * associated with the user.
 *
 * @param userId Optional parameter, if present, * the function will return lists associated with the user
 * @returns List of lists
 * @throws Error if an error occurs during the database query
 */
export const getListsService = async (
	userId?: number,
	listId?: number
): Promise<ListProps[]> => {
	try {
		const result = await models.lists.findAll({
			where: listId ? { listId } : {},
			include: [
				{
					model: models.items,
					as: "items",
					include: [
						{
							model: models.users,
							as: "createdBy_user",
							attributes: ["email"],
						},
					],
				},
				{
					model: models.users,
					as: "createdBy_user",
					attributes: ["email"],
				},
			],
		});

		// Convert the result to a plain object
		const lists = result.map((list) =>
			list.get({ plain: true })
		) as ListPropsRaw[];

		// Transform and return the updated lists
		return lists.map((list) => _transformList(list, userId));
	} catch (err) {
		throw new Error(err.message);
	}
};

/**
 * Checks whether a user is associated with a list.
 *
 * @param listId ID of the list
 * @userId ID of the user
 * @returns Promise that resolves to true if the user is associated with the list, false otherwise
 * @throws Error if an error occurs during the database query
 */
export const listBelongsToUserService = async (
	userId: number,
	listId: number
): Promise<boolean> => {
	try {
		const listUser = await models.userLists.findOne({
			where: { userId, listId },
		});
		return listUser !== null;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in listBelongsToUserService");
		}
	}
};

/**
 * Checks whether a user is the creator of a list.
 *
 * @param userId ID of the user
 * @param listId ID of the list
 * @returns Promise that resolves to true if the user is the creator of the list, false otherwise
 * @throws Error if an error occurs during the database query
 */
export const isUserCreatorService = async (
	userId: number,
	listId: number
): Promise<boolean> => {
	try {
		const list = await models.lists.findOne({
			where: { listId, createdBy: userId },
		});
		return list !== null;
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error("An error occurred in isUserCreatorService");
		}
	}
};

/**
 * Creates a new list in the database.
 *
 * @param userId ID of the creator of the list
 * @param title Title of the list
 */
export const createListService = async (
	userId: number,
	title: string
): Promise<number> => {
	try {
		const list = await models.lists.create({ title, createdBy: userId });
		const listId = list.listId;

		await models.userLists.create({ listId, userId });

		if (!list) {
			throw new Error("List could not be created");
		}

		return listId;
	} catch (err: unknown) {
		console.error(err);
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error("An error occurred in createListService");
		}
	}
};

/**
 * Returns all users associated with a list.
 *
 * @param listIds Ids of the lists to retrieve
 * @returns A dictionary where the keys are listIds and the values are arrays of user emails
 */
export const getAllListUsersService = async (
	listIds: number[]
): Promise<Record<string, string[]>> => {
	try {
		const userLists = await models.userLists.findAll({
			where: {
				listId: {
					[Op.in]: listIds,
				},
			},
			include: {
				model: models.users,
				as: "user",
				attributes: ["email"],
			},
		});

		const plainUserLists = userLists.map((userList) =>
			userList.get({ plain: true })
		);
		return _groupEmailByListId(plainUserLists);
	} catch (error: unknown) {
		console.error(error);
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in getAllListUsersService");
		}
	}
};

export const getListService = async (listId: number) => {
	try {
		return getListsService;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in getListService");
		}
	}
};

/**
 * Updates the title of a list.
 *
 * @param listId ID of the list to update
 * @param title  New title of the list
 * @throws Error if an error occurs during the database query
 */
export const updateListService = async (
	listId: number,
	title: string
): Promise<void> => {
	try {
		const list = await models.lists.findOne({ where: { listId } });
		if (!list) {
			return null;
		}
		list.title = title;
		await list.save();
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in updateListService");
		}
	}
};

/**
 * Deletes a list from the database. Also deletes all userLists associated with the list.
 *
 * @param listId ID of the list to delete
 * @throws Error if an error occurs during the database query
 */
export const deleteListService = async (listId: number): Promise<void> => {
	try {
		await models.userLists.destroy({ where: { listId } });
		await models.lists.destroy({ where: { listId } });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in deleteUserService");
		}
	}
};

/**
 * Deletes an item from a list.
 *
 * @param itemId ID of the item to delete
 * @throws Error if an error occurs during the database query
 */
export const deleteItemFromListService = async (
	itemId: number
): Promise<void> => {
	try {
		await models.items.destroy({ where: { itemId } });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in deleteItemFromListService");
		}
	}
};

/**
 * Add an item to a list. An item contains listId, title, description,
 *  userId, flag, and deadline.
 *
 * @param item Item to add to the list, contains listId, title, description, userId, flag, and deadline
 * @throws Error if an error occurs during the database query
 */
export const addItemToListService = async (item: CreateItem): Promise<void> => {
	try {
		await models.items.create({
			listId: item.listId,
			title: item.title,
			description: item.description,
			createdBy: item.userId,
			flag: item.flag,
			deadline: new Date(item.deadline),
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in addItemToListService");
		}
	}
};

/**
 *
 * Updates item in a given list. The attributes
 * that can be updated are title, description, flag, and deadline.
 *
 * @param data
 * @returns Null if the item is not found, otherwise the updated item
 */
export const updateItemInListService = async (
	data: ItemPropsBase
): Promise<null | itemsAttributes> => {
	try {
		const item = await models.items.findOne({
			where: { itemId: data.itemId },
		});
		if (!item) {
			return null;
		}
		item.set({
			title: data.title,
			description: data.description,
			flag: data.flag,
			deadline: new Date(data.deadline),
		});
		await item.save();
		return item.get({ plain: true });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in updateItemInListService");
		}
	}
};

/**
 * Adds a new user to a list. Assumes both the list and the user exist.
 * Creates a new userLists entry in the database.
 *
 * @param listId ID of the list
 * @param userId  ID of the user
 * @throws Error if an error occurs during the database query
 */
export const addUserToListService = async (
	listId: number,
	userId: number
): Promise<void> => {
	try {
		await models.userLists.create({ listId, userId });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in addUserToListService");
		}
	}
};

/**
 * Removes a user from a list. Assumes existence of the list and the users
 * association with the list.
 *
 * @param listId ID of the list
 * @param email Email of the user to remove
 * @throws Error if an error occurs during the database query
 */
export const removeUserFromListService = async (
	listId: number,
	email: string
): Promise<void> => {
	try {
		const user = (await models.users.findOne({ where: { email } })).get({
			plain: true,
		});

		await models.userLists.destroy({
			where: { listId, userId: user.userId },
		});
	} catch (error: unknown) {
		handleServiceError(error, "removeUserFromListService");
	}
};

/**
 * Finds the users ID associated with the email.
 *
 * @param email Email of the user
 * @returns User object if the user is found, null otherwise
 * @throws Error if an error occurs during the database query
 */
export const getUserByEmailService = async (
	email: string
): Promise<null | usersAttributes> => {
	try {
		const user = await models.users.findOne({ where: { email } });
		if (!user) {
			return null;
		}
		return user.get({ plain: true });
	} catch (error: unknown) {
		handleServiceError(error, "getUserByEmailService");
	}
};

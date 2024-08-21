import { models } from "src/db";
import { CreateItem } from "src/types";
import {
	ItemProps,
	ItemPropsBase,
	ItemPropsRaw,
	ListProps,
	ListPropsRaw,
} from "./types";
import { Op } from "sequelize";

const _transformItem = (item: ItemPropsRaw, userId?: number): ItemProps => {
	console.log(userId, item.createdBy, userId === item.createdBy);
	const { createdBy_user, createdBy, listId, ...rest } = item;
	return {
		...rest,
		isCreator: userId === createdBy,
		creatorEmail: userId ? createdBy_user.email : null,
	};
};

const _transformList = (list: ListPropsRaw, userId?: number): ListProps => {
	const { createdBy_user, createdBy, items, ...rest } = list;
	return {
		...rest,
		items: items.map((item) => _transformItem(item, userId)),
		isCreator: userId === createdBy,
		creatorEmail: userId ? createdBy_user.email : null,
	};
};

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

// Main service function
export const getAllListsService = async (
	userId?: number
): Promise<ListProps[]> => {
	try {
		const result = await models.lists.findAll({
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

export const getAllListUsersService = async (listIds: number[]) => {
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

export const createListService = async (
	userId: number,
	title: string
): Promise<void> => {
	try {
		const list = await models.lists.create({ title, createdBy: userId });
		const listId = list.listId;

		await models.userLists.create({ listId, userId });

		if (!list) {
			throw new Error("List could not be created");
		}
	} catch (err: unknown) {
		console.error(err);
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error("An error occurred in createListService");
		}
	}
};

export const getMyListsService = async (
	userId: number
): Promise<ListProps[]> => {
	try {
		const myLists = await models.lists.findAll({ where: { userId } });

		if (!myLists) {
			throw new Error("Lists could not be found");
		}

		return myLists.map((myList) => myList.get({ plain: true }));
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw new Error(err.message);
		} else {
			throw new Error("An error occurred in getMyListsService");
		}
	}
};

export const getListService = async (listId: number) => {
	try {
		const list = await models.lists.findOne({
			where: { listId },
			raw: true,
		});
		if (!list) {
			return null;
		}
		return list;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in getListService");
		}
	}
};

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

export const updateListService = async (
	listId: number,
	title: string
): Promise<ListProps | null> => {
	try {
		const list = await models.lists.findOne({ where: { listId } });
		if (!list) {
			return null;
		}
		list.title = title;
		await list.save();
		return list;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in updateListService");
		}
	}
};

export const deleteListService = async (
	userId: number,
	listId: number
): Promise<void> => {
	try {
		await models.userLists.destroy({ where: { userId, listId } });
		await models.lists.destroy({ where: { listId } });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in deleteUserService");
		}
	}
};

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

export const updateItemInListService = async (data: ItemPropsBase) => {
	try {
		console.log("updating");
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
		const updatedItem = await item.save();

		return updatedItem;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in updateItemInListService");
		}
	}
};

export const addUserToListService = async (listId: number, userId: number) => {
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

export const removeUserFromListService = async (
	listId: number,
	email: string
) => {
	try {
		const user = (await models.users.findOne({ where: { email } })).get({
			plain: true,
		});

		await models.userLists.destroy({
			where: { listId, userId: user.userId },
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in removeUserFromListService");
		}
	}
};

export const getUserByEmailService = async (email: string) => {
	try {
		const user = await models.users.findOne({ where: { email } });
		if (!user) {
			return null;
		}
		return user.get({ plain: true });
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An error occurred in getUserByEmailService");
		}
	}
};

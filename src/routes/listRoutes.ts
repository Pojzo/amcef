/**
 * @file List routes
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import {
	handleAddItemToList,
	handleAddUserToList,
	handleCreateList,
	handleDeleteItemFromList,
	handleDeleteList,
	handleGetAllLists,
	handleGetList,
	handleGetMyLists,
	handleRemoveUserFromList,
	handleUpdateItemInList,
} from "src/controllers/listController";
import {
	authMiddleware,
	optionalAuthMiddleware,
} from "src/middleware/authMiddleware";

const listRouter = express.Router();

// Getting and creating lists
listRouter.get("/", optionalAuthMiddleware, handleGetAllLists);
listRouter.get("/:listId", handleGetList);

// Creating and updating lists and items
listRouter.post("/", authMiddleware, handleCreateList);
listRouter.post("/:listId/items", authMiddleware, handleAddItemToList);
listRouter.put(
	"/:listId/items/:itemId",
	authMiddleware,
	handleUpdateItemInList
);

// Deleting lists and items
listRouter.delete("/:listId", authMiddleware, handleDeleteList);
listRouter.delete(
	"/:listId/items/:itemId",
	authMiddleware,
	handleDeleteItemFromList
);

// Managing users in lists
listRouter.post("/:listId/users", authMiddleware, handleAddUserToList);
listRouter.delete(
	"/:listId/users/:email",
	authMiddleware,
	handleRemoveUserFromList
);

export default listRouter;

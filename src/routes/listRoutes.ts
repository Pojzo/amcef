/**
 * @file List routes
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";

// Controller functions
import {
	handleAddItemToList,
	handleAddUserToList,
	handleCreateList,
	handleDeleteItemFromList,
	handleDeleteList,
	handleGetAllItemsInList,
	handleGetAllLists,
	handleGetItemInList,
	handleGetList,
	handleRemoveUserFromList,
	handleUpdateItemInList,
	handleUpdateList,
} from "src/controllers/listController";

// Auth middleware
import {
	authMiddleware,
	optionalAuthMiddleware,
} from "src/middleware/authMiddleware";

// Validation functions
import {
	validateAddUserToList,
	validateCreateItem,
	validateCreateList,
	validateDeleteItem,
	validateDeleteList,
	validateGetItem,
	validateListId,
	validateRemoveUserFromList,
	validateUpdateItem,
	validateUpdateList,
} from "src/middleware/listValidator";

const listRouter = express.Router();

// Lists Routes
// Get all lists
listRouter.get("/", optionalAuthMiddleware, handleGetAllLists);

// Create a new list
listRouter.post("/", authMiddleware, validateCreateList, handleCreateList);

// Get a specific list by id
listRouter.get(
	"/:listId",
	optionalAuthMiddleware,
	validateListId,
	handleGetList
);

listRouter.put(
	"/:listId",
	authMiddleware,
	validateUpdateList,
	handleUpdateList
);

// Delete a list
listRouter.delete(
	"/:listId",
	authMiddleware,
	validateDeleteList,
	handleDeleteList
);

// Users Routes (Related to specific lists)
// Add a user to a list
listRouter.post(
	"/:listId/users",
	authMiddleware,
	validateAddUserToList,
	handleAddUserToList
);

// Remove a user from a list
listRouter.delete(
	"/:listId/users/:email",
	authMiddleware,
	validateRemoveUserFromList,
	handleRemoveUserFromList
);

// pici tu

// Retrieve all items from a list
listRouter.get(
	"/:listId/items",
	optionalAuthMiddleware,
	validateListId,
	handleGetAllItemsInList
);

// Items Routes (Related to specific lists)
// Add a new item to a list
listRouter.post(
	"/:listId/items",
	authMiddleware,
	validateCreateItem,
	handleAddItemToList
);

// Retrieve a single item from a list
listRouter.get(
	"/:listId/items/:itemId",
	optionalAuthMiddleware,
	validateGetItem,
	handleGetItemInList
);

// Update an item in a list
listRouter.put(
	"/:listId/items/:itemId",
	authMiddleware,
	validateUpdateItem,
	handleUpdateItemInList
);

// Delete an item from a list
listRouter.delete(
	"/:listId/items/:itemId",
	authMiddleware,
	validateDeleteItem,
	handleDeleteItemFromList
);

export default listRouter;

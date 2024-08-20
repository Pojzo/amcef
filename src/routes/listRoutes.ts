/**
 * @file List routes
 * @author Peter Kovac
 * @date 19.8.2024
 */

import express from "express";
import { handleAddItemToList, handleCreateList, handleDeleteItemFromList, handleDeleteList, handleGetAllLists, handleGetItemsInList, handleGetList, handleGetMyLists, handleUpdateItemInList, handleUpdateList as handleUpdateList } from "src/controllers/listController";
import { authMiddleware } from "src/middleware/authMiddleware";

const listRouter = express.Router();

listRouter.get("/", handleGetAllLists);
listRouter.post("/", authMiddleware, handleCreateList);
listRouter.get("/my-lists", authMiddleware, handleGetMyLists);

listRouter.get("/:listId", handleGetList);
listRouter.put("/:listId", authMiddleware, handleUpdateList);
listRouter.delete("/:listId", authMiddleware, handleDeleteList);

listRouter.post(":listId/items", authMiddleware, handleAddItemToList);
listRouter.get(":listId/items", handleGetItemsInList);
listRouter.put(":listId/items/:itemId", authMiddleware, handleUpdateItemInList);
listRouter.delete(":listId/items/:itemId", authMiddleware, handleDeleteItemFromList);

export default listRouter;
/**
 * @file Contains controllers for list management.
 * @author Peter Kovac
 * @date 20.8.2024
 */

import { Request, Response } from 'express';
import { createListService, deleteListService, getAllListsService, getListService, getMyListsService, listBelongsToUserService, updateListService } from 'src/services/listServices';

export const handleGetAllLists = async (req: Request, res: Response) => {
    try {
        const lists = await getAllListsService();
        res.status(200).json({ lists });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error: " + error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleCreateList = async (req: Request, res: Response) => {
    console.log('creating list');
    try {
       const list = await createListService(req.body.userId, req.body.title); 

       return res.status(201).json({ list });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error: " + error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleGetMyLists = async (req: Request, res: Response) => {
    try {
       const myLists = await getMyListsService(req.body.userId); 

       return res.status(200).json({ myLists });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error: " + error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleGetList = async (req: Request, res: Response) => {
    try {
        const listId = parseInt(req.params.listId);
        const listBelongsToUser = await listBelongsToUserService(req.body.userId, listId);
        if (!listBelongsToUser) {
            return res.status(403).json({ message: "List does not belong to user" });
        }
        const list = await getListService(listId);

        res.status(200).json({ list });
       }
     catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error: " + error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleUpdateList = async (req: Request, res: Response) => {
    try {
        const listId = parseInt(req.params.listId);
        const listExists = await getListService(listId);
        if (!listExists) {
            return res.status(404).json({ message: "List not found" });
        }
        await updateListService(listId, req.body.title);
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error: " + error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
        
    }
}

export const handleDeleteList = async (req: Request, res: Response) => {
    try {
        console.log('deleting list 1')
        const listId = parseInt(req.params.listId);
        await deleteListService(req.body.userId, listId);    
        console.log('deleted list 2');
        res.status(204).end();
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ message: "Internal Server Error: " + err.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleAddItemToList = async (req: Request, res: Response) => {
}

export const handleGetItemsInList = async (req: Request, res: Response) => {
}

export const handleUpdateItemInList = async (req: Request, res: Response) => {
}

export const handleDeleteItemFromList = async (req: Request, res: Response) => {
}
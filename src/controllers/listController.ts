/**
 * @file Contains controllers for list management.
 * @author Peter Kovac
 * @date 20.8.2024
 */

import { Request, Response } from 'express';

export const handleGetAllLists = async (req: Request, res: Response) => {
    try {
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Internal Server Error", error });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
        
    }
}

export const handleCreateList = async (req: Request, res: Response) => {
}

export const handleGetMyLists = async (req: Request, res: Response) => {
}

export const handleGetList = async (req: Request, res: Response) => {
}

export const handleUpdateList = async (req: Request, res: Response) => {
}

export const handleDeleteList = async (req: Request, res: Response) => {
}

export const handleAddItemToList = async (req: Request, res: Response) => {
}

export const handleGetItemsInList = async (req: Request, res: Response) => {
}

export const handleUpdateItemInList = async (req: Request, res: Response) => {
}

export const handleDeleteItemFromList = async (req: Request, res: Response) => {
}
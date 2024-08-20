import { models } from "src/db";

interface List {
    listId: number,
    title: string
}

export const getAllListsService = (): Promise<List[]> => {
    try {
        return models.lists.findAll();
    }
    catch(err) {
        throw new Error(err);
    }
}
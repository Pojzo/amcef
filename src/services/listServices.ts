import { models } from "src/db";

interface List {
    listId: number,
    title: string
}

export const getAllListsService = async (): Promise<List[]> => {
    try {
        return await models.lists.findAll();
    }
    catch(err) {
        throw new Error(err);
    }
}

export const createListService = async (userId: number, title: string): Promise<List> => {
    try {
        const list = await models.lists.create({ title, createdBy: userId });
        const listId = list.listId;

        const listUser = await models.userLists.create({listId, userId});

        if (!list) {
            throw new Error("List could not be created");
        }
        return list;
    } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error("An error occurred in createListService");
        } 
    }
}

export const getMyListsService = async (userId: number): Promise<List[]> => {
    try {
        const myLists = await models.lists.findAll({ where: { userId } }); 

        if (!myLists) {
            throw new Error("Lists could not be found");
        }

        return myLists.map(myList => myList.get({ plain: true }));
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        else {
            throw new Error("An error occurred in getMyListsService");
        }
    }
}

export const getListService = async (listId: number): Promise<List |null> => {
    try {
        const list = await models.lists.findOne({ where: { listId } });
        if (!list) {
            return null;
        }
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An error occurred in getListService');
        }
        
    }
}

export const listBelongsToUserService = async (userId: number, listId: number): Promise<boolean> => {
    try {
        const listUser = await models.userLists.findOne({ where: { userId, listId } });
        return listUser !== null;
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An error occurred in listBelongsToUserService');
        }
        
    }
}

export const updateListService = async (listId: number, title: string): Promise<List | null> => {
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
        }
        else {
            throw new Error('An error occurred in updateListService');
        }
    }
}

export const deleteListService = async (userId: number, listId: number): Promise<void> => {
    try {
        await models.userLists.destroy({ where: { userId, listId } });
        await models.lists.destroy({ where: { listId } });
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An error occurred in deleteUserService');
        }
    }
}
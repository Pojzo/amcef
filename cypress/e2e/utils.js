import { URL } from "./config";

export const createListRequest = (token, listData) => {
	return {
		url: `${URL}/lists`,
		method: "POST",
		body: listData,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		failOnStatusCode: false,
	};
};

export const itemDummyData = {
	title: "Test item",
	description: "Test description",
	deadline: "2021-12-31T23:59:59.999Z",
	flag: "active",
};

export const createNewItemRequest = (token, listId, itemData) => {
	return {
		url: `${URL}/lists/${listId}/items`,
		method: "POST",
		body: itemData,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		failOnStatusCode: false,
	};
};

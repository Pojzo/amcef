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

const routeUsageMap = {
	"/auth/register": 0,
	"/auth/login": 0,
	"/auth/logout": 0,
	"/auth/is-logged-in": 0,

	"/lists/": 0, // Get all lists
	"/lists/:listId": 0, // Get a specific list by id
	"/lists/:listId/items": 0, // Retrieve all items from a list
	"/lists/:listId/items/:itemId": 0, // Retrieve a single item from a list

	// List Management
	"/lists": 0, // Create a new list
	"/lists/:listId": 0, // Delete a list

	// Item Management
	"/lists/:listId/items": 0, // Add a new item to a list
	"/lists/:listId/items/:itemId": 0, // Update an item in a list
	"/lists/:listId/items/:itemId": 0, // Delete an item from a list

	// User Management
	"/lists/:listId/users": 0, // Add a user to a list
	"/lists/:listId/users/:email": 0, // Remove a user from a list
};

export const getRoute = (route) => {
	if (route in routeUsageMap) {
		routeUsageMap[route]++;
	}
	return `${URL}${route}`;
};

export const getRouteUsage = () => {
	return routeUsageMap;
};

let i = 0;
export const usersCreated = [];

export const createDummyUser = () => {
	const registrationData = {
		email: `example${i++}@gmail.com`,
		password: "TestPassword123",
	};
	usersCreated.push(registrationData);
	return registrationData;
};

export const createRegisterRequestData = (registrationData) => {
	return {
		method: "POST",
		url: getRoute("/auth/register"),
		body: registrationData,
		failOnStatusCode: false,
	};
};

import { URL } from "./spec.cy";

const routes = [
	{
		method: "POST",
		path: "/auth/logout",
		description: "Logout user",
	},
	{
		method: "POST",
		path: "/lists/{listId}/users",
		description: "Add a user to a list",
	},
	{
		method: "DELETE",
		path: "/lists/{listId}/users/{email}",
		description: "Remove a user from a list",
	},
	{
		method: "POST",
		path: "/lists/{listId}/items",
		description: "Add an item to a list",
	},
	{
		method: "DELETE",
		path: "/lists/{listId}/items/{itemId}",
		description: "Delete an item from a list",
	},
	{
		method: "PUT",
		path: "/lists/{listId}/items/{itemId}",
		description: "Update an item in a list",
	},
];

describe("Protected routes", () => {
	routes.forEach((route) => {
		it(`Check ${route.description} without token`, () => {
			cy.request({
				url: `${URL}${route.path}`,
				method: route.method,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(401);
			});
		});
	});
});

describe("Protected routes after logout", () => {
	let token;
	before(() => {
		cy.request({
			url: `${URL}/auth/delete/example@gmail.com`,
			method: "POST",
			failOnStatusCode: false, // This might fail if the token is invalid after logout
		});

		const registerData = {
			email: "example2@gmail.com",
			password: "Password",
		};

		// Register the user and get the token
		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: registerData,
		}).then((response) => {
			token = response.body.token;
			// Log out the user after registration
			return cy.request({
				url: `${URL}/auth/logout`,
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		});
	});

	// Iterate through each route and test them after logout
	routes.forEach((route) => {
		if (route.path.includes("logout")) return;
		it(`Check ${route.description} after logout`, () => {
			cy.request({
				url: `${URL}${route.path}`,
				method: route.method,
				headers: {
					Authorization: `Bearer ${token}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(401); // Expecting Unauthorized status
			});
		});
	});

	// Clean up after tests
	after(() => {
		cy.request({
			url: `${URL}/auth/delete/example2@gmail.com`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			failOnStatusCode: false, // This might fail if the token is invalid after logout
		});
	});
});

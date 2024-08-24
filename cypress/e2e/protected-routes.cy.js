import { URL } from "./config";
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
			failOnStatusCode: false,
		});

		const registerData = {
			email: "example2@gmail.com",
			password: "Password",
		};

		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: registerData,
		}).then((response) => {
			token = response.body.token;
			return cy.request({
				url: `${URL}/auth/logout`,
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		});
	});

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
				expect(response.status).to.eq(401);
			});
		});
	});

	after(() => {
		cy.request({
			url: `${URL}/auth/delete/example2@gmail.com`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			failOnStatusCode: false,
		});
	});
});

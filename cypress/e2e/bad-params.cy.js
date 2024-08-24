import { URL } from "./config";
import {
	createListRequest,
	createNewItemRequest,
	itemDummyData,
} from "./utils";

const itemRequiredFields = ["title", "description", "deadline", "flag"];

describe("Bad parameters", () => {
	let token;
	let testListId;
	let itemId;
	before(() => {
		// Initialize data for testing
		// User and list creation
		const user = {
			email: "badparams@gmail.com",
			password: "Password",
		};
		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: user,
		}).then((response) => {
			token = response.body.token;
			return cy
				.request({
					url: `${URL}/lists`,
					method: "POST",
					body: { title: "Test list" },
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					testListId = response.body.list.listId;
					cy.request({
						url: `${URL}/lists/${testListId}/items`,
						method: "post",
						body: itemDummyData,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}).then((response) => {
						itemId = response.body.item.itemId;
					});
				});
		});
	});

	it("Create a list with missing title", () => {
		const createRequest = createListRequest(token, {});
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(400);
		});
	});

	it("Create a list with empty title", () => {
		const createRequest = createListRequest(token, { title: "" });
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(400);
		});
	});

	itemRequiredFields.forEach((field) => {
		it(`Create an item with missing ${field}`, () => {
			const itemData = { ...itemDummyData };
			delete itemData[field];

			const createRequest = createNewItemRequest(
				token,
				testListId,
				itemData
			);
			cy.request(createRequest).then((response) => {
				cy.log(response.body);
				expect(response.status).to.eq(400);
			});
		});
		it(`Create an item with empty ${field}`, () => {
			const itemData = { ...itemDummyData, [field]: "" };
			const createRequest = createNewItemRequest(
				token,
				testListId,
				itemData
			);
			cy.request(createRequest).then((response) => {
				expect(response.status).to.eq(400);
			});
		});
	});

	it("Create an item with invalid flag", () => {
		const itemData = { ...itemDummyData, flag: "invalid" };
		const createRequest = createNewItemRequest(token, testListId, itemData);
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(400);
		});
	});
	it("Create an item with valid flag", () => {
		const itemData = { ...itemDummyData, flag: "active" };
		const createRequest = createNewItemRequest(token, testListId, itemData);
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(201);
		});
	});
	it("Create an item with deadline with the wrong format", () => {
		const itemData = { ...itemDummyData, deadline: "2021-12-3" };
		const createRequest = createNewItemRequest(token, testListId, itemData);
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(400);
		});
	});
	it("Add an item to a list that does not exist", () => {
		const createRequest = createNewItemRequest(token, 32434, itemDummyData);
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(404);
		});
	});
	it("Add an item to a list that does exist", () => {
		const createRequest = createNewItemRequest(
			token,
			testListId,
			itemDummyData
		);
		cy.request(createRequest).then((response) => {
			expect(response.status).to.eq(201);
		});
	});
	it("Remove an item that does not exist", () => {
		const removeRequest = {
			url: `${URL}/lists/${testListId}/items/324234`,
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			failOnStatusCode: false,
		};
		cy.request(removeRequest).then((response) => {
			expect(response.status).to.eq(404);
		});
	});
	it("Removed item that was removed", () => {
		const createRequest = createNewItemRequest(
			token,
			testListId,
			itemDummyData
		);
		cy.request(createRequest).then((response) => {
			const itemId = response.body.item.itemId;
			const removeRequest = {
				url: `${URL}/lists/${testListId}/items/${itemId}`,
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			return cy
				.request(removeRequest)
				.then((response) => {
					expect(response.status).to.eq(200);
				})
				.then(() => {
					cy.request(removeRequest).then((response) => {
						expect(response.status).to.eq(404);
					});
				});
		});
	});
	after(() => {
		cy.request({
			url: `${URL}/auth/delete/`,
			method: "POST",
			failOnStatusCode: false,
			body: { email: "badparams@gmail.com" },
		});
	});
});

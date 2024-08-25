import { URL } from "./config";
import {
	createDummyUser,
	createNewItemRequest,
	itemDummyData,
	usersCreated,
} from "./utils";

describe("List items", () => {
	let token;
	let testListId;
	let itemId;
	before(() => {
		// Initialize data for testing
		// User and list creation
		const user = {
			email: "email123@gmail.com",
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
					console.log(itemId, response.body);
					expect(response.status).to.eq(204);
				})
				.then(() => {
					cy.request({
						url: `${URL}/lists/${testListId}/items/${itemId}`,
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
						failOnStatusCode: false,
					}).then((response) => {
						expect(response.status).to.eq(404);
					});
				});
		});
	});

	it("Update list", () => {
		const updatedList = {
			title: "Updated title",
		};
		cy.request({
			url: `${URL}/lists/${testListId}`,
			method: "PUT",
			body: updatedList,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body.list.title).to.eq(updatedList.title);
		});
	});
	it("Update non-existent list", () => {
		const updatedList = {
			title: "Updated title",
		};
		cy.request({
			url: `${URL}/lists/324234`,
			method: "PUT",
			body: updatedList,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(404);
		});
	});

	after(() => {
		cy.request({
			url: `${URL}/lists/${testListId}`,
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		cy.request({
			url: `${URL}/auth/delete/`,
			method: "POST",
			failOnStatusCode: false,
			body: { email: "email123@gmail.com" },
		});
	});
});

const itemTitles = ["item1", "item2", "item3", "item4", "item5"];
const itemDescriptions = ["desc1", "desc2", "desc3", "desc4", "desc5"];
const itemDeadlines = [
	"2022-01-01",
	"2022-01-02",
	"2022-01-03",
	"2022-01-04",
	"2022-01-05",
];

const itemFlags = ["active", "finished", "aborted", "active", "active"];

describe("Test item retrieval and updating", () => {
	const userEmail = "item@gmail.com";
	const userEmail2 = "item2@gmail.com";
	let token;
	let token2;
	let listId;
	let itemIds = [];

	before(() => {
		const user = {
			email: userEmail,
			password: "Password",
		};

		const user2 = {
			email: userEmail2,
			password: "Password",
		};

		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: user2,
		}).then((response) => {
			token2 = response.body.token;
		});

		// Register user and create a list, then handle item creation
		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: user,
		}).then((response) => {
			token = response.body.token;

			cy.request({
				url: `${URL}/lists`,
				method: "POST",
				body: { title: "Test list" },
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((response) => {
				listId = response.body.list.listId;

				const itemCreationRequests = itemTitles.map((title, i) => {
					const item = {
						title: title,
						description: itemDescriptions[i],
						deadline: itemDeadlines[i],
						flag: itemFlags[i],
					};

					return cy
						.request({
							url: `${URL}/lists/${listId}/items`,
							method: "POST",
							body: item,
							headers: {
								Authorization: `Bearer ${token}`,
							},
						})
						.then((response) => {
							itemIds.push(response.body.item.itemId);
						});
				});

				cy.wrap(itemCreationRequests).then(() => {});
			});
		});
	});

	it("Fetch all items in a list", () => {
		cy.request({
			url: `${URL}/lists/${listId}/items`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.items).to.have.length(5);
			const items = response.body.items;
			for (let i = 0; i < 5; i++) {
				expect(items[i].title).to.eq(itemTitles[i]);
				expect(items[i].description).to.eq(itemDescriptions[i]);
				expect(new Date(items[i].deadline).getTime()).to.eq(
					new Date(itemDeadlines[i]).getTime()
				);
				expect(items[i].flag).to.eq(itemFlags[i]);
				expect(items[i].creatorEmail).to.eq(userEmail);
				expect(items[i].isCreator).to.eq(true);
			}
		});
	});
	it("Fetch item based on id", () => {
		for (let i = 0; i < 5; i++) {
			cy.request({
				url: `${URL}/lists/${listId}/items/${itemIds[i]}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body.item.title).to.eq(itemTitles[i]);
				expect(response.body.item.description).to.eq(
					itemDescriptions[i]
				);
				expect(new Date(response.body.item.deadline).getTime()).to.eq(
					new Date(itemDeadlines[i]).getTime()
				);
				expect(response.body.item.flag).to.eq(itemFlags[i]);
			});
		}
	});

	it("Verify creator on list", () => {
		cy.request({
			url: `${URL}/lists/${listId}/items/${itemIds[0]}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${token2}`,
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.item.isCreator).to.eq(false);
			expect(response.body.item.creatorEmail).to.eq(userEmail);
		});
	});
	it("Verify creator on item", () => {
		cy.request({
			url: `${URL}/lists/${listId}/items/${itemIds[0]}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.item.isCreator).to.eq(true);
			expect(response.body.item.creatorEmail).to.eq(userEmail);
		});
		// now with another user
		cy.request({
			url: `${URL}/lists/${listId}/items/${itemIds[0]}`,
			method: "GET",
			headers: {
				Authorization: `Bearer ${token2}`,
			},
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body.item.isCreator).to.eq(false);
			expect(response.body.item.creatorEmail).to.eq(userEmail);
		});
	});

	it("Update item", () => {
		const updatedItem = {
			title: "Updated title",
			description: "Updated description",
			deadline: "2022-01-06",
			flag: "finished",
		};
		cy.request({
			url: `${URL}/lists/${listId}/items/${itemIds[0]}`,
			method: "PUT",
			body: updatedItem,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			console.log(response.body);

			expect(response.status).to.eq(200);
			expect(response.body.item.title).to.eq(updatedItem.title);
			expect(response.body.item.description).to.eq(
				updatedItem.description
			);
			expect(new Date(response.body.item.deadline).getTime()).to.eq(
				new Date(updatedItem.deadline).getTime()
			);
			expect(response.body.item.flag).to.eq(updatedItem.flag);
		});
	});
	it("Update item with user who is not part of a list", () => {
		const updatedItem = {
			title: "Updated title",
			description: "Updated description",
			deadline: "2022-01-06",
			flag: "finished",
		};
		cy.request({
			url: `${URL}/lists/${listId}/items/${itemIds[0]}`,
			method: "PUT",
			body: updatedItem,
			headers: {
				Authorization: `Bearer ${token2}`,
			},
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(403);
		});
	});
	it("Remove items", () => {
		for (let i = 0; i < 5; i++) {
			cy.request({
				url: `${URL}/lists/${listId}/items/${itemIds[i]}`,
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((response) => {
				expect(response.status).to.eq(204);
			});
		}
	});

	after(() => {
		cy.request({
			url: `${URL}/lists/${listId}`,
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		cy.request({
			url: `${URL}/auth/delete/`,
			method: "POST",
			failOnStatusCode: false,
			body: { email: userEmail },
		});
		cy.request({
			url: `${URL}/auth/delete/`,
			method: "POST",
			failOnStatusCode: false,
			body: { email: userEmail2 },
		});
	});
});

describe("Add and remove users from lists", () => {
	let user1Data;
	let user2Data;

	let user1;
	let user2;

	before(() => {
		user1Data = createDummyUser();
		user2Data = createDummyUser();
		console.log(user1Data, user2Data);
		cy.request({
			method: "POST",
			url: `${URL}/auth/register`,
			body: user1Data,
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body).to.have.property("token");
			user1 = response.body.token;
		});
		cy.request({
			method: "POST",
			url: `${URL}/auth/register`,
			body: user2Data,
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body).to.have.property("token");
			user2 = response.body.token;
		});
	});

	it("Create list", () => {
		const title = "Test list";
		cy.request({
			url: `${URL}/lists`,
			method: "POST",
			body: { title },
			headers: {
				Authorization: `Bearer ${user1}`,
			},
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body.list).to.have.property("listId");
			expect(response.body.list).to.have.property("title");
			expect(response.body.list.title).to.eq(title);
		});
	});

	it("Add user to list", () => {
		const title = "Test list";
		let listId;
		cy.request({
			url: `${URL}/lists`,
			method: "POST",
			body: { title },
			headers: {
				Authorization: `Bearer ${user1}`,
			},
		}).then((response) => {
			listId = response.body.list.listId;
			cy.request({
				url: `${URL}/lists/${listId}/users`,
				method: "POST",
				body: { email: user2Data.email },
				headers: {
					Authorization: `Bearer ${user1}`,
				},
			}).then((response) => {
				expect(response.status).to.eq(201);
			});
		});
	});

	it("Add a non-existing user to list", () => {
		const title = "Test list";
		let listId;
		cy.request({
			url: `${URL}/lists`,
			method: "POST",
			body: { title },
			headers: {
				Authorization: `Bearer ${user1}`,
			},
		}).then((response) => {
			listId = response.body.list.listId;
			cy.request({
				url: `${URL}/lists/${listId}/users`,
				method: "POST",
				body: { email: "noexistent@gmail.com" },
				headers: {
					Authorization: `Bearer ${user1}`,
				},
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(404);
			});
		});
	});
	it("Add a user to the list that is already in the list", () => {
		const title = "Test list";
		let listId;
		cy.request({
			url: `${URL}/lists`,
			method: "POST",
			body: { title },
			headers: {
				Authorization: `Bearer ${user1}`,
			},
		}).then((response) => {
			listId = response.body.list.listId;
			cy.request({
				url: `${URL}/lists/${listId}/users`,
				method: "POST",
				body: { email: user2Data.email },
				headers: {
					Authorization: `Bearer ${user1}`,
				},
			}).then((response) => {
				expect(response.status).to.eq(201);
				cy.request({
					url: `${URL}/lists/${listId}/users`,
					method: "POST",
					body: { email: user2Data.email },
					headers: {
						Authorization: `Bearer ${user1}`,
					},
					failOnStatusCode: false,
				}).then((response) => {
					expect(response.status).to.eq(409);
				});
			});
		});
	});

	after(() => {
		const deleteUrl = `${URL}/auth/delete`;
		usersCreated.forEach((user) => {
			cy.request({
				method: "POST",
				url: deleteUrl,
				body: { email: user.email },
			}).then((response) => {
				expect(response.status).to.eq(200);
			});
		});
	});
});

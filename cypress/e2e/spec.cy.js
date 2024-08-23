export const URL = "http://localhost:8888";

let i = 0;
const usersCreated = [];

const createDummyUser = () => {
	const registrationData = {
		email: `example${i++}@gmail.com`,
		password: "TestPassword123",
	};
	usersCreated.push(registrationData);
	return registrationData;
};

const createRegisterRequestData = (registrationData) => {
	return {
		method: "POST",
		url: `${URL}/auth/register`,
		body: registrationData,
		failOnStatusCode: false,
	};
};

describe("Authentication and authorization tests", () => {
	it("Test registration", () => {
		const registrationData = createDummyUser();

		cy.request("POST", `${URL}/auth/register`, registrationData).then(
			(response) => {
				expect(response.status).to.eq(201);
				expect(response.body).to.have.property("token");
			}
		);
	});

	it("Test registration with existing email", () => {
		const registrationData = createDummyUser();

		cy.request("POST", `${URL}/auth/register`, registrationData).then(
			(response) => {
				expect(response.status).to.eq(201);
				expect(response.body).to.have.property("token");
			}
		);
		const requestData = createRegisterRequestData(registrationData);

		cy.request(requestData).then((response) => {
			expect(response.status).to.eq(409);
			expect(response.body.message).to.eq("User already exists");
		});
	});

	it("Check login status after registration", () => {
		const registrationData = createDummyUser();

		cy.request("POST", `${URL}/auth/register`, registrationData).then(
			(response) => {
				expect(response.status).to.eq(201);
				expect(response.body).to.have.property("token");

				const headers = {
					Authorization: `Bearer ${response.body.token}`,
				};

				cy.request({
					url: `${URL}/auth/is-logged-in`,
					headers,
				}).then((response) => {
					expect(response.status).to.eq(200);
					expect(response.body).to.have.property("isLoggedIn");
					expect(response.body.isLoggedIn).to.eq(true);
				});
			}
		);
	});

	it("Check login status after login", () => {
		const registrationData = createDummyUser();

		// Register the user
		cy.request({
			method: "POST",
			url: `${URL}/auth/register`,
			body: registrationData,
		}).then((registrationResponse) => {
			// Assert registration response
			expect(registrationResponse.status).to.eq(201);
			expect(registrationResponse.body).to.have.property("token");
			const token = registrationResponse.body.token;

			const loginData = {
				email: registrationData.email,
				password: registrationData.password,
			};

			// Log in with the same credentials
			return cy
				.request({
					method: "POST",
					url: `${URL}/auth/login`,
					body: loginData,
				})
				.then((loginResponse) => {
					// Assert login response
					expect(loginResponse.status).to.eq(200);
					const headers = {
						Authorization: `Bearer ${loginResponse.body.token}`,
					};
					return cy.request({
						method: "GET",
						url: `${URL}/auth/is-logged-in`,
						headers,
					});
				})
				.then((response) => {
					expect(response.status).to.eq(200);
					expect(response.body).to.have.property("isLoggedIn");
					expect(response.body.isLoggedIn).to.eq(true);
				});
		});
	});

	it("Should not be logged in without token", () => {
		cy.request({
			url: `${URL}/auth/is-logged-in`,
			failOnStatusCode: false,
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property("isLoggedIn");
			expect(response.body.isLoggedIn).to.eq(false);
		});
	});

	it("Register with invalid email", () => {
		const registrationData = {
			email: "example",
			password: "TestPassword123",
		};
		const requestData = createRegisterRequestData(registrationData);
		cy.request(requestData).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include("Invalid email");
		});
	});

	it("Register with short password", () => {
		const registrationData = {
			email: "example@gmail.com",
			password: "Test",
		};
		const requestData = createRegisterRequestData(registrationData);
		cy.request(requestData).then((response) => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.include("Password");
		});
	});

	it("Register with missing email", () => {
		const registrationData = createDummyUser();
		delete registrationData.email;

		const requestData = createRegisterRequestData(registrationData);
		cy.request(requestData).then((response) => {
			expect(response.status).to.eq(400);
		});

		it("Register with missing password", () => {
			const registrationData = createDummyUser();
			delete registrationData.password;

			const requestData = createRegisterRequestData(registrationData);
			cy.request(requestData).then((response) => {
				expect(response.status).to.eq(400);
			});
		});
	});

	it("Check login status after logout", () => {
		const registrationData = createDummyUser();
		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: registrationData,
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body).to.have.property("token");
			expect(response.body.token).to.be.a("string");
			const headers = {
				Authorization: `Bearer ${response.body.token}`,
			};
			cy.request({
				url: `${URL}/auth/logout`,
				method: "POST",
				headers,
			}).then((response) => {
				expect(response.status).to.eq(200);
				cy.request({
					url: `${URL}/auth/is-logged-in`,
					headers,
				}).then((response) => {
					expect(response.status).to.eq(200);
					expect(response.body).to.have.property("isLoggedIn");
					expect(response.body.isLoggedIn).to.eq(false);
				});
			});
		});
	});
	it("Check login status with malformed token", () => {
		const registrationData = createDummyUser();
		cy.request({
			url: `${URL}/auth/register`,
			method: "POST",
			body: registrationData,
		}).then((response) => {
			expect(response.status).to.eq(201);
			expect(response.body).to.have.property("token");
			expect(response.body.token).to.be.a("string");
			const headers = {
				Authorization: `Bearer ${response.body.token}malformed`,
			};
			cy.request({
				url: `${URL}/auth/is-logged-in`,
				headers,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(500);
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

describe("Add and remove users from lists", () => {
	let user1Data;
	let user2Data;

	let user1;
	let user2;

	before(() => {
		user1Data = createDummyUser();
		user2Data = createDummyUser();
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

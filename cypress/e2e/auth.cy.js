import {
	createDummyUser,
	createRegisterRequestData,
	getRoute,
	getRouteUsage,
	usersCreated,
} from "./utils";

describe("Authentication and authorization tests", () => {
	it("Test registration", () => {
		const registrationData = createDummyUser();

		cy.request("POST", getRoute("/auth/register"), registrationData).then(
			(response) => {
				expect(response.status).to.eq(201);
				expect(response.body).to.have.property("token");
			}
		);
	});

	it("Test registration with existing email", () => {
		const registrationData = createDummyUser();

		cy.request("POST", getRoute("/auth/register"), registrationData).then(
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

		cy.request("POST", getRoute("/auth/register"), registrationData).then(
			(response) => {
				expect(response.status).to.eq(201);
				expect(response.body).to.have.property("token");

				const headers = {
					Authorization: `Bearer ${response.body.token}`,
				};

				cy.request({
					url: getRoute("/auth/is-logged-in"),
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
			url: getRoute("/auth/register"),
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
					url: getRoute("/auth/login"),
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
						url: getRoute("/auth/is-logged-in"),
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
			url: getRoute("/auth/is-logged-in"),
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
			url: getRoute("/auth/register"),
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
				url: getRoute("/auth/logout"),
				method: "POST",
				headers,
			}).then((response) => {
				expect(response.status).to.eq(200);
				cy.request({
					url: getRoute("/auth/is-logged-in"),
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
			url: getRoute("/auth/register"),
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
				url: getRoute("/auth/is-logged-in"),
				headers,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(200);
			});
		});
	});

	after(() => {
		const deleteUrl = getRoute("/auth/delete");
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

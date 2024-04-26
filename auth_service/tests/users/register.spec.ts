const { request } = require("http");
const app = require("../../src/app");

describe("POST auth/register", () => {
    describe("Given all fields", () => {
        it("should return 201", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "ajay980p@gmail.com",
                password: "password",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.status).toBe(201);
        });
    });
});

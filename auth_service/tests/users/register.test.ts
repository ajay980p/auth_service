import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
    describe("Given all the fields", () => {
        it("should return the status 201", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john430@gmail.com",
                password: "password",
            };

            const response = await request(app).post("/auth/register").send(userData);
            expect(response.statusCode).toBe(201);
        });

        it("Should persist the user into the database", async () => {
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john430@gmail.com",
                password: "password",
            };

            const response = await request(app).post("/auth/register").send(userData);
            expect(response.statusCode).toBe(201);
        });
    });
});

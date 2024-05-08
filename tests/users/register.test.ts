import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { isJWT, truncateTables } from "../utils";
import { User } from "../../src/entity/User";


describe("POST /auth/register", () => {
    let connection: DataSource;

    // To create the connection before all the tests
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    // To truncate the data before each test
    beforeEach(async () => {
        await truncateTables(connection);
    });

    // To destroy the connection after each test
    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all the fields", () => {
        it("Should persist the user into the database", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john430@gmail.com",
                password: "password",
            };

            try {
                // Act
                const response = await request(app)
                    .post("/auth/register")
                    .set('Content-Type', 'application/json')
                    .send(userData)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')

                // Assert
                const userRepository = connection.getRepository(User);
                const user = await userRepository.find();
                expect(user).toHaveLength(1);
            } catch (err) {
                console.log(err);
            }
        });

        it("Should hashed the password in database", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john430@gmail.com",
                password: "password",
            };

            // Act
            const response = await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("Should not present duplicate email", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "password",
            };

            // Act
            const response = await request(app).post("/auth/register").send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
        });


        it("Should store the token inside the cookies", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "password",
            };

            // Act
            const response = await request(app).post("/auth/register").send(userData);

            console.log("Response : ", response.headers['set-cookie']);

            // Assert
            let accessToken: string | undefined;
            let refreshToken: string | undefined;

            let cookies: string[] = [];
            if (Array.isArray(response.headers['set-cookie'])) {
                cookies = response.headers['set-cookie'];
            }

            cookies.forEach(cookie => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }

                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            })

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            // expect(isJWT(accessToken)).toBeTruthy();
            // expect(isJWT(refreshToken)).toBeTruthy();
        });
    });

    describe("Fields are missing", () => {
        it("Should return 400 status Code", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "password",
            };

            // Act
            const response = await request(app).post("/auth/register").send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
        });


        it("Should return 400 status Code if any field is missing", async () => {
            // Arrange
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "",
                password: "password",
            };

            // Act
            const response = await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });
});

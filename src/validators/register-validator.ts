import { checkSchema } from "express-validator";

// export const registerValidator = [
//     body("email").isEmail().withMessage("Invalid email"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be atleast 6 characters long"),
//     body("firstName").isString().withMessage("First name must be a string"),
//     body("lastName").isString().withMessage("Last name must be a string"),
// ];

export default checkSchema({
    firstName: {
        isString: true,
        errorMessage: 'First name is required',
        notEmpty: true
    },
    lastName: {
        isString: true,
        errorMessage: 'Last name is required',
        notEmpty: true
    },
    email: {
        errorMessage: 'Email is required',
        notEmpty: true
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password should be at least 8 chars',
        },
        notEmpty: true
    },
});
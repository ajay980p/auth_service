import { checkSchema } from "express-validator";

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
        notEmpty: true,
        isEmail: true
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password should be at least 8 chars',
        },
        notEmpty: true
    },
});
import { checkSchema } from "express-validator";

export default checkSchema({
    firstName: {
        in: ['body'],
        isString: {
            errorMessage: 'First name must be a string',
        },
        notEmpty: {
            errorMessage: 'First name is required',
        },
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: {
            errorMessage: 'Last name must be a string',
        },
        notEmpty: {
            errorMessage: 'Last name is required',
        },
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Email is required',
        },
        isEmail: {
            errorMessage: 'Invalid email format',
        },
        normalizeEmail: true,
    },
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Password is required',
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password should be at least 8 characters long',
        },
        matches: {
            options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        },
    },
});
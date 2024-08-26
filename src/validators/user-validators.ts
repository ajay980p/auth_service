import { checkSchema } from "express-validator";

export const deleteUserIdValidator = checkSchema({
    userId: {
        isNumeric: true,
        errorMessage: 'User Id is required',
        notEmpty: true
    }
});


export const getAllUserDataValidator = checkSchema({
    currentPage: {
        isNumeric: true,
        errorMessage: 'Current Page is required',
        notEmpty: true
    },
    pageSize: {
        isNumeric: true,
        errorMessage: 'Page Size is required',
        notEmpty: true
    }
});


export const updateUserDataValidator = checkSchema({
    userId: {
        in: ['body'],
        isNumeric: {
            errorMessage: 'User Id must be a number',
        },
        notEmpty: {
            errorMessage: 'User Id is required',
        },
    },
    firstName: {
        in: ['body'],
        isString: {
            errorMessage: 'First Name must be a string',
        },
        notEmpty: {
            errorMessage: 'First Name is required',
        },
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: 'First Name must be between 2 and 50 characters',
        },
    },
    lastName: {
        in: ['body'],
        isString: {
            errorMessage: 'Last Name must be a string',
        },
        notEmpty: {
            errorMessage: 'Last Name is required',
        },
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: 'Last Name must be between 2 and 50 characters',
        },
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Email must be valid',
        },
        notEmpty: {
            errorMessage: 'Email is required',
        },
        normalizeEmail: true,
    },
    role: {
        in: ['body'],
        isString: {
            errorMessage: 'Role must be a string',
        },
        notEmpty: {
            errorMessage: 'Role is required',
        },
    },
});
import { checkSchema } from "express-validator";

export const deleteUserIdValidator = checkSchema({
    userId: {
        in: ['body'],
        isNumeric: {
            errorMessage: 'User Id must be a number',
        },
        notEmpty: {
            errorMessage: 'User Id is required',
        },
    },
});


export const getAllUserDataValidator = checkSchema({
    currentPage: {
        in: ['body'],
        isInt: {
            options: { min: 1 },
            errorMessage: 'Current Page must be a positive integer',
        },
        notEmpty: {
            errorMessage: 'Current Page is required',
        },
        toInt: true,
    },
    pageSize: {
        in: ['body'],
        isInt: {
            options: { min: 1 },
            errorMessage: 'Page Size must be a positive integer',
        },
        notEmpty: {
            errorMessage: 'Page Size is required',
        },
        toInt: true,
    },
    search: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Search must be a string',
        },
        trim: true,
        escape: true,
    },
    searchRole: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Search Role must be a string',
        },
        trim: true,
        escape: true,
    }
});


export const createUserDataValidator = checkSchema({
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
    tenantId: {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Tenant Id must be a number',
        },
        notEmpty: {
            errorMessage: 'Tenant Id is required',
        },
    },
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
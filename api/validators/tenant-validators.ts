import { checkSchema } from "express-validator";

export const createTenantValidator = checkSchema({
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string',
        },
        notEmpty: {
            errorMessage: 'Name is required',
        },
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        isString: {
            errorMessage: 'Address must be a string',
        },
        notEmpty: {
            errorMessage: 'Address is required',
        },
        trim: true,
        escape: true,
    },
    mailId: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'MailId is required',
        },
        isEmail: {
            errorMessage: 'Invalid email format',
        },
        normalizeEmail: true,
    }
});

export const updateTenantValidator = checkSchema({
    id: {
        in: ['body'],
        isInt: {
            errorMessage: 'Id must be an integer',
        },
        notEmpty: {
            errorMessage: 'Id is required',
        },
        toInt: true,
    },
    name: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Name must be a string',
        },
        trim: true,
        escape: true,
    },
    address: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Address must be a string',
        },
        trim: true,
        escape: true,
    },
    mailId: {
        in: ['body'],
        optional: true,
        isEmail: {
            errorMessage: 'Invalid email format',
        },
        normalizeEmail: true,
    }
});

export const deleteTenantValidator = checkSchema({
    id: {
        in: ['body'],
        isInt: {
            errorMessage: 'Id must be an integer',
        },
        notEmpty: {
            errorMessage: 'Id is required',
        },
        toInt: true,
    }
});

export const getAllTenantsDataValidator = checkSchema({
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
            options: { min: 1, max: 100 },
            errorMessage: 'Page Size must be a positive integer',
        },
        notEmpty: {
            errorMessage: 'Page Size is required',
        },
        toInt: true,
    },

});
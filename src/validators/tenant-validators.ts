import { checkSchema } from "express-validator";

export const createTenantValidator = checkSchema({
    name: {
        isString: true,
        errorMessage: 'Name is required',
        notEmpty: true
    },
    address: {
        isString: true,
        errorMessage: 'Address is required',
        notEmpty: true
    },
    mailId: {
        isEmail: true,
        errorMessage: 'MailId is required',
        notEmpty: true
    }
});


export const updateTenantValidator = checkSchema({
    id: {
        isNumeric: true,
        errorMessage: 'Id is required',
        notEmpty: true
    },
    name: {
        isString: true,
        errorMessage: 'Name is required',
        notEmpty: false
    },
    address: {
        isString: true,
        errorMessage: 'Address is required',
        notEmpty: false
    },
    mailId: {
        isEmail: true,
        errorMessage: 'MailId is required',
        notEmpty: false
    }
});


export const deleteTenantValidator = checkSchema({
    id: {
        isNumeric: true,
        errorMessage: 'Id is required',
        notEmpty: true
    }
});
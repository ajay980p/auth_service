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
import { checkSchema } from "express-validator";

export const deleteUserIdValidator = checkSchema({
    userId: {
        isNumeric: true,
        errorMessage: 'User Id is required',
        notEmpty: true
    }
});
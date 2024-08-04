import { checkSchema } from "express-validator";

export default checkSchema({
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
});
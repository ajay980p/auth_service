import { checkSchema } from "express-validator";

export default checkSchema({
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
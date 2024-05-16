import createHttpError from "http-errors";

export const errorHandler = (statusCode: number, message: string, value: string) => {
    const status = statusCode || 500;
    const error = createHttpError(status, message, {
        errors: [
            {
                type: "field",
                value,
                msg: message,
            },
        ],
    });
    return error;
};
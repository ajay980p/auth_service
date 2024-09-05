import createHttpError from "http-errors";

export const errorHandler = (statusCode: number, message: string, value: string) => {
    const status = statusCode || 500;

    console.log("Status code : 2334 ", status)

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
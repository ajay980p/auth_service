import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {
        service: "auth_service",
    },
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.combine(winston.format.json(), winston.format.timestamp()),
            ),
        }),

        new winston.transports.File({
            level: "error",
            filename: "logs/error.log",
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            silent: false,
        }),
    ],
});

export default logger;

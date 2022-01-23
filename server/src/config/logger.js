import winston from 'winston';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

const transport = new WinstonDailyRotateFile({
    filename: '%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [transport],
    exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

logger.stream = {
    write(message) {
        logger.info(message);
    },
};

export default logger;

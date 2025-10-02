import pino from 'pino';

export const logger = pino({
  name: 'pharma-platform',
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
  redact: {
    paths: ['req.headers.authorization', '*.secret', '*.token'],
    remove: true,
  },
});

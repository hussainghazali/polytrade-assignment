import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as SlackHook from 'winston-slack-webhook-transport';
import { Postgres } from 'winston-postgres'; // Import Postgres transport from 'winston-postgres';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      // Add a timestamp to the console logs
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
      }),
    ),
  }),

  new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(), // Add a timestamp to file logs
      winston.format.json(),
    ),
  }),

  new SlackHook({
    webhookUrl: 'https://hooks.slack.com/services/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',
    channel: '#general',
    username: 'LoggerBot',
    level: 'error',

    format: winston.format.combine(
      winston.format.timestamp(), // Add a timestamp to Slack logs
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
      }),
    ),
  }),

  new Postgres({
    level: 'info',
    connectionString: 'postgres://postgres:0513@localhost:5432/finsight', // Provide your PostgreSQL connection string here
    tableName: 'logger', // Name of the table to store logs
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),
];

export const Logs = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});

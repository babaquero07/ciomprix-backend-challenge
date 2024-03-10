import winston from "winston";
import { randomBytes } from "crypto";
import DailyRotateFile from "winston-daily-rotate-file";

import fs from "fs";
import readline from "readline";

const logFilePath = "logs/application-logs.log";

const { combine, timestamp, json, printf } = winston.format;

const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

const generateLogId = (): string => randomBytes(16).toString("hex");

export const httpLogger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        logId: generateLogId(),
        timestamp,
        appInfo: {
          appVersion: "1.0.0",
          environment: process.env.NODE_ENV, // development/staging/production
          proccessId: process.pid,
        },
        message,
        data,
      };

      return JSON.stringify(response, null, 4);
    })
  ),
  transports: [
    // log to console
    new winston.transports.Console({
      // if set to true, logs will not appear
      silent: true,
    }),
    // log to file
    new winston.transports.File({
      filename: "logs/application-logs.log",
    }),
    // log to file, but rotate daily
    new DailyRotateFile({
      filename: "logs/rotating-logs-%DATE%.log", // file name includes current date
      datePattern: "MMMM-DD-YYYY",
      zippedArchive: false, // zip logs true/false
      maxSize: "20m", // rotate if file size exceeds 20 MB
      maxFiles: "14d", // max files
    }),
  ],
});

export const getLastLogs = async () => {
  try {
    const logContent = fs.readFileSync(logFilePath, "utf8");

    return logContent;
  } catch (error) {
    console.log(error);

    throw new Error("Error while reading logs");
  }
};

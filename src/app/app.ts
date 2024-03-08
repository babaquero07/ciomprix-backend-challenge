import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

import fs from "fs";
import path from "path";

config();

const COOKIE_SECRET = process.env.COOKIE_SECRET;

const app = express();

// Middlewares
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Logger TODO: Remove in production
app.use(morgan("dev"));

app.use("/api", routes);

export default app;

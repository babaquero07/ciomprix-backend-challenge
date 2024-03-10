import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

import responseInterceptor from "./logger/response.interceptor";

config();

const COOKIE_SECRET = process.env.COOKIE_SECRET;

const app = express();

// Middlewares
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

// Logger
app.use(responseInterceptor);

// Console logger
app.use(morgan("dev"));

app.use("/api", routes);

export default app;

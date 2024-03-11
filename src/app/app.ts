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

const allowedOrings = [
  "https://ciomprix-backend-challenge-production.up.railway.app",
  "http://localhost",
];
const options: cors.CorsOptions = {
  origin: allowedOrings,
  credentials: true,
};

// Middlewares
app.use(cors(options));
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

// Logger
app.use(responseInterceptor);

// Console logger
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

export default app;

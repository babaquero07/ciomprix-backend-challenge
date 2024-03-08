import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
// import routes from './routes'

config();

const app = express();

// Middlewares
app.use(cors({ credentials: true }));
app.use(express.json());

// Logger TODO: Remove in production
app.use(morgan("dev"));

// app.use('/api', routes)

export default app;

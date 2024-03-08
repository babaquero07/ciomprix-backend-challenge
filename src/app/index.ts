import app from "./app";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/api`);
});

server.on("error", console.error);

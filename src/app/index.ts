import app from "./app";
import { config } from "dotenv";
import { swaggerDocs } from "../documentation/swagger";

config();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/api`);
  swaggerDocs(app, PORT);
});

server.on("error", console.error);

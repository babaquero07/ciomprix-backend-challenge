import { config } from "dotenv";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

config();

// Metadata info about our API
const options = {
  definition: {
    info: {
      title: "Ciomprix backend challenge",
      version: "1.0.0",
      description: "API Documentation",
      contact: {
        name: "Alexander Baquero",
        url: "https://github.com/babaquero07",
      },
    },
    servers: [
      { url: "http://localhost:8080", description: "Development server" },
    ],
    basePath: "/api",
  },
  apis: ["**/*.ts", "**/**/*.ts"],
  explore: true,
};

// Docs in JSON format
const swaggerSpec = swaggerJsDoc(options);

// Function to setup our docs
export const swaggerDocs = (app, port) => {
  if (process.env.NODE_ENV !== "production") {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    console.log(`📑 Docs are available at http://localhost:${port}/api/docs`);
  }
};

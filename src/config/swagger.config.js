const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Booking API",
      version: "1.0.0",
      description: "API documentation for the Hotel Booking system",
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to API route files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:8080/api-docs");
};

module.exports = swaggerDocs;

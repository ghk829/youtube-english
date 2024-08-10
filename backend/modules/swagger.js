const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Minos API",
      version: "1.0.0",
      description: "Minos API with express",
    },
    host: "localhost:8000",
    basePath: "/",
  },
  apis: ["./routes/*.js", "./swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};

const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Ecom Backend API",
    description: "E-commerce backend ki auto-generated API documentation",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:5000" }],
  tags: [
    { name: "Auth" },
    { name: "User" },
    { name: "Category" },
    { name: "Brand" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "accessToken" },
    },
    schemas: {
      LoginBody: { email: "rahul@gmail.com", password: "123456" },
    },
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
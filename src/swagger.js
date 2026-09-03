const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
 info: {
  title: "SmartKanban API",
  description: "SmartKanban project management API documentation",
  version: "1.0.0",
},
  servers: [{ url: "http://localhost:5000" }],
  tags: [
  { name: "Auth" },
  { name: "Users" },
  { name: "Projects" },
  { name: "Boards" },
  { name: "Tasks" },
  { name: "Time Tracking" },
  { name: "Analytics" },
  { name: "Workload" },
  { name: "Recommendation" },
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
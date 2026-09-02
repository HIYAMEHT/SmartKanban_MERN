const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
});

const doc = {
  info: {
    title: "SmartKanban API",
    description: "SmartKanban backend API documentation",
    version: "1.0.0",
  },

  servers: [
    {
      url: "http://localhost:5000",
    },
  ],

  tags: [
    { name: "Workload" },
    { name: "Deadline" },
    { name: "Capacity" },
    { name: "Recommendation" },
  ],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
};

const outputFile = "./src/swagger-output.json";

const endpointsFiles = [
  "./src/app.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
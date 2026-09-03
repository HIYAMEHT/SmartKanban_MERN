const express = require("express");

const {
  register,
  login,
  logout,
  getSession,
  refresh,
} = require("./auth.controller");

const {
  validateRegister,
  validateLogin,
} = require("./auth.validator");

const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

// ===============================
// REGISTER
// ===============================

router.post(
  "/register",
  validateRegister,
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Register a new user'
    #swagger.description = 'Creates a new SmartKanban user account.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: {
                type: "string",
                example: "Rohan Verma"
              },
              email: {
                type: "string",
                format: "email",
                example: "rohan.verma2026@gmail.com"
              },
              password: {
                type: "string",
                format: "password",
                example: "Rohan@2026"
              },
              bio: {
                type: "string",
                example: "Backend developer"
              },
              role: {
                type: "string",
                enum: ["user", "admin"],
                example: "user"
              },
              skills: {
                type: "array",
                items: {
                  type: "string"
                },
                example: ["JavaScript", "Node.js", "MongoDB"]
              },
              availability: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["available", "unavailable"],
                    example: "available"
                  },
                  hoursPerDay: {
                    type: "number",
                    example: 6
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: 'User registered successfully'
    }

    #swagger.responses[400] = {
      description: 'Validation error'
    }

    #swagger.responses[409] = {
      description: 'User with this email already exists'
    }

    #swagger.responses[500] = {
      description: 'Internal server error'
    }
  */
  register
);


// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  validateLogin,
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Login user'
    #swagger.description = 'Authenticates an existing SmartKanban user.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                format: "email",
                example: "rohan.verma2026@gmail.com"
              },
              password: {
                type: "string",
                format: "password",
                example: "Rohan@2026"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: 'Login successful'
    }

    #swagger.responses[400] = {
      description: 'Validation error'
    }

    #swagger.responses[401] = {
      description: 'Invalid email or password'
    }
  */
  login
);


// ===============================
// LOGOUT
// ===============================

router.post(
  "/logout",
  authMiddleware,
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Logout user'
    #swagger.description = 'Logs out the currently authenticated user.'

    #swagger.security = [{
      "cookieAuth": []
    }]

    #swagger.responses[200] = {
      description: 'Logout successful'
    }

    #swagger.responses[401] = {
      description: 'Unauthorized'
    }
  */
  logout
);


// ===============================
// REFRESH
// ===============================

router.post(
  "/refresh",
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Refresh authentication session'
    #swagger.description = 'Generates new access and refresh tokens using the refresh token cookie.'

    #swagger.responses[200] = {
      description: 'Session refreshed successfully'
    }

    #swagger.responses[401] = {
      description: 'Refresh token is missing, expired, or invalid'
    }
  */
  refresh
);


// ===============================
// SESSION
// ===============================

router.get(
  "/session",
  authMiddleware,
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Get current user session'
    #swagger.description = 'Returns the currently authenticated user session.'

    #swagger.security = [{
      "cookieAuth": []
    }]

    #swagger.responses[200] = {
      description: 'Session active'
    }

    #swagger.responses[401] = {
      description: 'Unauthorized'
    }

    #swagger.responses[404] = {
      description: 'User not found'
    }
  */
  getSession
);


module.exports = router;
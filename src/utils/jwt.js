const jwt = require("jsonwebtoken");

const getAccessSecret = () => {
  const secret =
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return secret;
};

const getRefreshSecret = () => {
  const secret =
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return secret;
};

// Get user ID whether a user object or ID is provided
const getUserId = (user) => {
  if (!user) return null;

  if (typeof user === "string") {
    return user;
  }

  if (user._id) {
    return user._id.toString();
  }

  if (user.userId) {
    return user.userId.toString();
  }

  return null;
};

// Get role from user object
const getUserRole = (user) => {
  if (!user || typeof user !== "object") {
    return undefined;
  }

  return user.role;
};

// Generate Access Token
const generateAccessToken = (user) => {
  const userId = getUserId(user);

  if (!userId) {
    throw new Error("User ID is required to generate access token");
  }

  return jwt.sign(
    {
      userId,
      role: getUserRole(user),
    },
    getAccessSecret(),
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const userId = getUserId(user);

  if (!userId) {
    throw new Error("User ID is required to generate refresh token");
  }

  return jwt.sign(
    {
      userId,
      type: "refresh",
    },
    getRefreshSecret(),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};

// Generate normal access token
const generateToken = (user) => {
  return generateAccessToken(user);
};

// Verify Access Token
const verifyToken = (token) => {
  return jwt.verify(token, getAccessSecret());
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
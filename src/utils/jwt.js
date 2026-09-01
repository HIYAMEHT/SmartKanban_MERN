const jwt = require("jsonwebtoken");

const getAccessSecret = () => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return process.env.JWT_ACCESS_SECRET;
};

const getRefreshSecret = () => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return process.env.JWT_REFRESH_SECRET;
};


// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    getAccessSecret(),
    {
      expiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );
};


// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      type: "refresh",
    },
    getRefreshSecret(),
    {
      expiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    }
  );
};


// Generate normal access token
const generateToken = (user) => {
  return generateAccessToken(user);
};


// Verify Access Token
const verifyToken = (token) => {
  return jwt.verify(
    token,
    getAccessSecret()
  );
};


// Verify Refresh Token
const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    getRefreshSecret()
  );
};


module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
const jwt = require("jsonwebtoken");

const getAccessSecret = () =>
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const getRefreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, getAccessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: "refresh" }, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const generateToken = (userId) => {
  return generateAccessToken(userId);
};

const verifyToken = (token, secret = getAccessSecret()) => {
  return jwt.verify(token, secret);
};

const verifyRefreshToken = (token) => {
  return verifyToken(token, getRefreshSecret());
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};

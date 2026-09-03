const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../user/user.model");

const ApiError = require("../../utils/apiError");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt");

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  skills: user.skills,
  availability: user.availability,
  createdAt: user.createdAt,
});

const registerUser = async ({
  name,
  email,
  password,
  bio,
  role,
  skills,
  availability,
}) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    bio: bio || "",
    role: role || "user",
    skills: Array.isArray(skills)
      ? skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [],
    availability: availability || {
      status: "available",
      hoursPerDay: 8,
    },
  });
const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);
  // const accessToken = generateAccessToken(user._id);
  // const refreshToken = generateRefreshToken(user._id);
  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpiresAt = refreshTokenExpiresAt;
  await user.save();

  return {
    user: buildUserResponse(user),
    tokens: {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: 15 * 60,
      refreshTokenExpiresIn: 7 * 24 * 60 * 60,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // IMPORTANT: pass complete user
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const refreshTokenExpiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpiresAt = refreshTokenExpiresAt;

  await user.save();

  return {
    user: buildUserResponse(user),
    tokens: {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: 15 * 60,
      refreshTokenExpiresIn: 7 * 24 * 60 * 60,
    },
  };
};

const getSessionUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return buildUserResponse(user);
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = "";
  user.refreshTokenExpiresAt = null;
  await user.save();

  return { loggedOut: true };
};

const refreshUserSession = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new ApiError(401, "Refresh token is required");
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshTokenValue);
  } catch (error) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.refreshToken || !user.refreshTokenExpiresAt) {
    throw new ApiError(401, "No active session found");
  }

  const storedHash = hashToken(refreshTokenValue);

  if (user.refreshToken !== storedHash) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  if (new Date(user.refreshTokenExpiresAt).getTime() < Date.now()) {
    user.refreshToken = "";
    user.refreshTokenExpiresAt = null;
    await user.save();
    throw new ApiError(401, "Refresh token expired");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  const nextExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.refreshToken = hashToken(newRefreshToken);
  user.refreshTokenExpiresAt = nextExpiry;
  await user.save();

  return {
    user: buildUserResponse(user),
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresIn: 15 * 60,
      refreshTokenExpiresIn: 7 * 24 * 60 * 60,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
  getSessionUser,
  logoutUser,
  refreshUserSession,
};

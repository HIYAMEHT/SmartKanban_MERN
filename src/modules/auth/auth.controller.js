const authService = require("./auth.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: result.user,
        accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
        refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      },
      "User registered successfully",
    ),
  );
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: result.user,
        accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
        refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      },
      "Login successful",
    ),
  );
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logoutUser(req.user.userId);
  clearAuthCookies(res);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Logout successful"));
});

const getSession = asyncHandler(async (req, res) => {
  const user = await authService.getSessionUser(req.user.userId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, session: { expiresIn: 15 * 60 } },
        "Session active",
      ),
    );
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies && req.cookies.refreshToken;
  const result = await authService.refreshUserSession(refreshToken);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: result.user,
        accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
        refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      },
      "Session refreshed successfully",
    ),
  );
});

module.exports = {
  register,
  login,
  logout,
  getSession,
  refresh,
};

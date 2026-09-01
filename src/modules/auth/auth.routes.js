const express = require("express");
const {
  register,
  login,
  logout,
  getSession,
  refresh,
} = require("./auth.controller");
const { validateRegister, validateLogin } = require("./auth.validator");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", authMiddleware, logout);
router.post("/refresh", refresh);
router.get("/session", authMiddleware, getSession);

module.exports = router;

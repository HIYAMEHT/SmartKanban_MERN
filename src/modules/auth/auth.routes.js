import express from "express";
import {
    register,
    login
} from "./auth.controller.js";

import {
    validateRegister,
    validateLogin
} from "./auth.validator.js";

const router = express.Router();

router.post(
    "/register",
    validateRegister,
    register
);

router.post(
    "/login",
    validateLogin,
    login
);

export default router;
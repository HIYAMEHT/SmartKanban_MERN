import * as authService from "./auth.service.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
    const result = await authService.registerUser(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            result,
            "User registered successfully"
        )
    );
});

export const login = asyncHandler(async (req, res) => {
    const result = await authService.loginUser(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Login successful"
        )
    );
});
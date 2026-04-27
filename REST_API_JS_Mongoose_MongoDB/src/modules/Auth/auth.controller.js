import * as authService from "./auth.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async (req, res) => {
	const user = await authService.register(req.body);
	ApiResponse.created(res, "User registered successfully", user);
};

const login = async (req, res) => {
	const { user, accessToken, refreshToken } = await authService.login(req.body);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
	ApiResponse.ok(res, "User logged in successfully", { user, accessToken });
};

const refreshAccessToken = async (req, res) => {
	const refreshToken =
		req.cookies?.refreshToken || // web (cookie)
		req.headers.authorization?.split(" ")[1]; // mobile (header);

	if (!refreshToken) {
		return ApiError.unauthorized("Refresh token required");
	}

	const {
		user,
		accessToken,
		refreshToken: newRefreshToken,
	} = await authService.refreshAccessToken(refreshToken);
	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
	ApiResponse.ok(res, "Access token refreshed successfully", {
		user,
		accessToken,
	});
};

const logout = async (req, res) => {
	await authService.logout(req.user.id);
	res.clearCookie("refreshToken");
	ApiResponse.ok(res, "User logged out successfully");
};

const getMe = async (req, res) => {
	const user = await authService.getMe(req.user.id);
	ApiResponse.ok(res, "User profile fetched successfully", user);
};

export { register, login, refreshAccessToken, logout, getMe };

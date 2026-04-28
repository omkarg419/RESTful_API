import ApiError from "../../common/utils/api-error.js";
import {
	generateAccessToken,
	generateRefreshToken,
	generateResetToken,
	verifyRefreshToken,
} from "../../common/utils/jwt.utills.js";
import User from "./auth.model.js";
import crypto from "crypto";
import {
	sendVerificationEmail,
	sendResetPasswordEmail,
} from "../../common/config/email.js";

const hashToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
	const existingUser = await User.findOne({ email });

	if (existingUser) throw ApiError.conflict("User email alredy exisits");

	const { rowToken, hashedToken } = generateResetToken();

	const user = await User.create({
		name,
		email,
		password,
		role,
		verificationToken: hashedToken,
	});

	try {
		await sendVerificationEmail(email, rowToken);
	} catch (error) {
		console.error("Error sending verification email:", error);
	}

	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.verificationToken;

	return userObj;
};

const verifyEmail = async (token) => {
	if (!token) throw ApiError.badRequest("Verification token is required");

	const hashedToken = hashToken(token);
	let user = await User.findOne({ verificationToken: hashedToken }).select(
		"+verificationToken",
	);
	if (!user) {
		const user = await User.findOne({ verificationToken: token }).select;
	}
	if (!user) throw ApiError.badRequest("Invalid verification token");
	user.isVerified = true;
	user.verificationToken = undefined;
	await user.save({ validateBeforeSave: false });
};

const login = async ({ email, password }) => {
	const user = await User.findOne({ email }).select("+password");
	if (!user) throw ApiError.unauthorized("Invalid email or password");

	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch)
		throw ApiError.unauthorized("Invalid email or password");

	if (!user.isVerified)
		throw ApiError.forbbiden("Please verify your email to login");

	const accessToken = generateAccessToken({ id: user._id, role: user.role });
	const refreshToken = generateRefreshToken({ id: user._id });

	user.refreshToken = hashToken(refreshToken);
	await user.save({ validateBeforeSave: false });

	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.refreshToken;

	return { user: userObj, accessToken, refreshToken };
};

const refreshAccessToken = async (token) => {
	if (!token) throw ApiError.unauthorized("Refresh token is required");

	let decoded;
	try {
		decoded = verifyRefreshToken(token);
	} catch (err) {
		throw ApiError.unauthorized("Invalid or expired refresh token");
	}

	const user = await User.findById(decoded.id).select("+refreshToken");
	if (!user) throw ApiError.unauthorized("User not Found");

	const isMatch = crypto.timingSafeEqual(
		Buffer.from(user.refreshToken),
		Buffer.from(hashToken(token)),
	);
	if (!isMatch) {
		throw ApiError.unauthorized("Invalid refreshToken");
	}

	const accessToken = generateAccessToken({ id: user._id, role: user.role });
	const newRefreshToken = generateRefreshToken({ id: user._id });

	user.refreshToken = hashToken(newRefreshToken);
	await user.save({ validateBeforeSave: false });

	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.refreshToken;

	return { user: userObj, accessToken, refreshToken: newRefreshToken };
};

const logOut = async (userId) => {
	await User.findOneAndUpdate({ _id: userId }, { refreshToken: null });
};

const forgotPassword = async (email) => {
	const user = await User.findOne({ email });
	if (!user) throw ApiError.notFound("User not found");

	const { rowToken, hashedToken } = generateResetToken();

	user.resetPasswordToken = hashedToken;
	user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

	await user.save({ validateBeforeSave: false });

	// TODO: send an email to user with rowtoken to reset password
	try {
		await sendResetPasswordEmail(email, rowToken);
	} catch (error) {
		console.error("Error sending reset password email:", error);
	}
};

const resetPassword = async (token, newPassword) => {
	if (!token) throw ApiError.badRequest("Reset token is required");

	const hashedToken = hashToken(token);

	const user = await User.findOne({
		resetPasswordToken: hashedToken,
		resetPasswordExpires: { $gt: Date.now() },
	}).select("+resetPasswordToken +resetPasswordExpires");
	if (!user) throw ApiError.badRequest("Invalid or expired reset token");

	user.password = newPassword;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;

	await user.save({ validateBeforeSave: false });
};

const getMe = async (userId) => {
	const user = await User.findById(userId);
	if (!user) {
		throw ApiError.unauthorized("User not found");
	}
	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.refreshToken;
	return userObj;
};

export {
	register,
	login,
	refreshAccessToken,
	logOut,
	forgotPassword,
	resetPassword,
	getMe,
	verifyEmail,
};

import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateResetToken = () => {
	const rowToken = crypto.randomBytes(32).toString("hex");
	const hashedToken = crypto
		.createHash("sha256")
		.update(rowToken)
		.digest("hex");

	return { rowToken, hashedToken };
};

const generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
		expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
	});
};

const verifyAccessToken = (token) => {
	return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const generateRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
	});
};

const verifyRefreshToken = (token) => {
	return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export {
	generateResetToken,
	generateAccessToken,
	verifyAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
};
